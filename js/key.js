// Get URL parameters and key
const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('key');

// Redirect to home if no key is provided
if (!key) {
  window.location.href = './';
}

// Get HTML elements
const HEART_BUTTON = document.getElementById('heart');
const GRADIENT_ELEMENT = document.getElementById('gradient');
const TEXT_ELEMENT = document.getElementById('text');

let isAnimating = false;

// Main function to decrypt and reveal the message
async function main() {
  // Fetch encrypted data and decrypt it
  const encryptedText = await fetch('./data/encrypted_data.txt').then(res => res.text());
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  // Set up message revealing
  const FULL_MESSAGE = decryptedText;
  const TOTAL_CLICKS_REQUIRED = 8;
  const MESSAGE_LENGTH = FULL_MESSAGE.length;
  const REVEAL_AMOUNT_PER_CLICK = Math.ceil(MESSAGE_LENGTH / TOTAL_CLICKS_REQUIRED);

  let revealedMessage = Array(MESSAGE_LENGTH).fill(' ');
  let revealedCharacterIndexes = new Set();
  let totalClicks = 0;

  // Handle heart button click to reveal more message
  function handleClick() {
    if (isAnimating) return;
    isAnimating = true;

    const remainingToReveal = MESSAGE_LENGTH - revealedCharacterIndexes.size;
    if (remainingToReveal <= 0) return;

    // Trigger animations
    HEART_BUTTON.style.animation = 'beat 0.6s ease-in-out';
    GRADIENT_ELEMENT.classList.add("expanded");

    // Get unrevealed character indexes
    const unrevealedIndexes = [...FULL_MESSAGE]
      .map((_, index) => index)
      .filter(index => !revealedCharacterIndexes.has(index));

    // Reveal a set number of characters
    const numberToReveal = Math.min(REVEAL_AMOUNT_PER_CLICK, remainingToReveal);
    for (let i = 0; i < numberToReveal; i++) {
      const randomIndex = unrevealedIndexes.splice(Math.floor(Math.random() * unrevealedIndexes.length), 1)[0];
      revealedCharacterIndexes.add(randomIndex);
      revealedMessage[randomIndex] = FULL_MESSAGE[randomIndex];
    }

    // Update the displayed message
    TEXT_ELEMENT.textContent = revealedMessage.join('');

    totalClicks++;
  }

  // Add event listener to heart button
  HEART_BUTTON.addEventListener('click', handleClick);
}

// Reset gradient animation when it ends
GRADIENT_ELEMENT.onanimationend = () => {
  GRADIENT_ELEMENT.style.animation = ''; // Reset animation
  GRADIENT_ELEMENT.classList.remove("expanded");
}

// Reset heart button animation when it ends
HEART_BUTTON.onanimationend = () => {
  HEART_BUTTON.style.animation = ''; // Reset animation
  isAnimating = false;
};

// Call main to start
main();