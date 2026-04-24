const identityStatus = document.querySelector('#identityStatus');
const contactList = document.querySelector('#contactList');
const activeContactName = document.querySelector('#activeContactName');
const messageStream = document.querySelector('#messageStream');
const composer = document.querySelector('#composer');
const messageInput = document.querySelector('#messageInput');
const clearConversation = document.querySelector('#clearConversation');
const regenerateIdentity = document.querySelector('#regenerateIdentity');
const messageTemplate = document.querySelector('#messageTemplate');

const state = {
  me: null,
  activeContactId: null,
  contacts: [
    { id: 'lena', name: 'Lena Park', preview: 'Design review complete ✅' },
    { id: 'miles', name: 'Miles Rivera', preview: 'Meet me at 7 near the marina.' },
    { id: 'sora', name: 'Sora Ahmed', preview: 'Trip itinerary is ready.' },
  ],
  conversations: new Map(),
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toB64 = (arr) => btoa(String.fromCharCode(...new Uint8Array(arr)));
const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

async function createIdentity(name = 'You') {
  const agreementKeys = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  return {
    id: crypto.randomUUID(),
    name,
    agreementKeys,
  };
}

async function deriveSharedKey(privateKey, publicKey) {
  return crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptMessage(sharedKey, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    encoder.encode(plaintext)
  );

  return {
    iv: toB64(iv),
    ciphertext: toB64(ciphertext),
  };
}

async function decryptMessage(sharedKey, payload) {
  const iv = fromB64(payload.iv);
  const ciphertext = fromB64(payload.ciphertext);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    ciphertext
  );

  return decoder.decode(plainBuffer);
}

async function ensureConversation(contactId) {
  if (state.conversations.has(contactId)) {
    return state.conversations.get(contactId);
  }

  const contactIdentity = await createIdentity(
    state.contacts.find((contact) => contact.id === contactId)?.name ?? 'Contact'
  );
  const sharedKeyForMe = await deriveSharedKey(
    state.me.agreementKeys.privateKey,
    contactIdentity.agreementKeys.publicKey
  );
  const sharedKeyForContact = await deriveSharedKey(
    contactIdentity.agreementKeys.privateKey,
    state.me.agreementKeys.publicKey
  );

  const conversation = {
    messages: [],
    keys: {
      me: sharedKeyForMe,
      them: sharedKeyForContact,
    },
  };

  state.conversations.set(contactId, conversation);
  return conversation;
}

function renderContacts() {
  contactList.innerHTML = '';

  state.contacts.forEach((contact) => {
    const button = document.createElement('button');
    button.className = `contact ${contact.id === state.activeContactId ? 'active' : ''}`;
    button.type = 'button';
    button.innerHTML = `
      <div class="contact-title">
        <strong>${contact.name}</strong>
        <span>🔒</span>
      </div>
      <p class="contact-snippet">${contact.preview}</p>
    `;

    button.addEventListener('click', async () => {
      state.activeContactId = contact.id;
      await ensureConversation(contact.id);
      renderContacts();
      renderMessages();
    });

    contactList.append(button);
  });
}

async function renderMessages() {
  const contact = state.contacts.find((entry) => entry.id === state.activeContactId);

  if (!contact) {
    activeContactName.textContent = 'Select a contact';
    messageStream.innerHTML = '<p class="system-note">Choose a conversation to begin.</p>';
    composer.style.visibility = 'hidden';
    return;
  }

  activeContactName.textContent = contact.name;
  composer.style.visibility = 'visible';

  const conversation = await ensureConversation(contact.id);
  messageStream.innerHTML = '';

  if (!conversation.messages.length) {
    messageStream.innerHTML =
      '<p class="system-note">Messages are encrypted with AES-256-GCM using ephemeral ECDH-derived keys.</p>';
    return;
  }

  for (const encryptedMessage of conversation.messages) {
    const sharedKey = encryptedMessage.sender === 'me' ? conversation.keys.them : conversation.keys.me;
    const plaintext = await decryptMessage(sharedKey, encryptedMessage.payload);

    const fragment = messageTemplate.content.cloneNode(true);
    const bubbleWrap = fragment.querySelector('.bubble-wrap');
    const bubble = fragment.querySelector('.bubble');
    const time = fragment.querySelector('time');

    bubbleWrap.classList.add(encryptedMessage.sender === 'me' ? 'me' : 'them');
    bubble.textContent = plaintext;
    time.textContent = new Date(encryptedMessage.sentAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    messageStream.append(fragment);
  }

  messageStream.scrollTop = messageStream.scrollHeight;
}

async function sendEncryptedMessage(rawText) {
  const text = rawText.trim();
  if (!text || !state.activeContactId) return;

  const conversation = await ensureConversation(state.activeContactId);
  const payloadForContact = await encryptMessage(conversation.keys.me, text);

  conversation.messages.push({
    sender: 'me',
    payload: payloadForContact,
    sentAt: Date.now(),
  });

  setTimeout(async () => {
    const autoReply = `Encrypted echo: ${text}`;
    const payloadForMe = await encryptMessage(conversation.keys.them, autoReply);

    conversation.messages.push({
      sender: 'them',
      payload: payloadForMe,
      sentAt: Date.now(),
    });

    if (state.activeContactId) {
      renderMessages();
    }
  }, 450);

  renderMessages();
}

async function bootstrap() {
  state.me = await createIdentity();
  identityStatus.textContent = `Device ready • ${state.me.id.slice(0, 8)}… • ECDH P-256`;

  state.activeContactId = state.contacts[0].id;

  renderContacts();
  await ensureConversation(state.activeContactId);
  await renderMessages();
}

composer.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = messageInput.value;
  messageInput.value = '';
  await sendEncryptedMessage(text);
});

clearConversation.addEventListener('click', async () => {
  if (!state.activeContactId) return;
  const conversation = await ensureConversation(state.activeContactId);
  conversation.messages = [];
  renderMessages();
});

regenerateIdentity.addEventListener('click', async () => {
  state.me = await createIdentity();
  state.conversations.clear();
  identityStatus.textContent = `Identity regenerated • ${state.me.id.slice(0, 8)}…`;
  await ensureConversation(state.activeContactId);
  await renderMessages();
});

bootstrap();
