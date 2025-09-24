// Custom cursor functionality
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Game variables
let gameActive = false;
let score = 0;
let timeLeft = 30;
let gameTimer;
let spawnTimer;
let votes = [];

const gameArea = document.getElementById('gameArea');
const playerToothless = document.getElementById('playerToothless');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startGameBtn = document.getElementById('startGameBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');

// Touch/Mouse control for player
let playerX = gameArea.offsetWidth / 2;
const playerSpeed = 5;

function updatePlayerPosition(clientX) {
    const gameRect = gameArea.getBoundingClientRect();
    const relativeX = clientX - gameRect.left;
    playerX = Math.max(30, Math.min(gameArea.offsetWidth - 30, relativeX));
    playerToothless.style.left = playerX - 30 + 'px';
}

// Mouse control
gameArea.addEventListener('mousemove', (e) => {
    if (gameActive) {
        updatePlayerPosition(e.clientX);
    }
});

// Touch control
gameArea.addEventListener('touchmove', (e) => {
    if (gameActive) {
        e.preventDefault();
        const touch = e.touches[0];
        updatePlayerPosition(touch.clientX);
    }
});

// Prevent scrolling on touch
gameArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
});

// Create falling vote
function createVote() {
    const vote = document.createElement('div');
    vote.className = 'vote';
    vote.style.left = Math.random() * (gameArea.offsetWidth - 30) + 'px';
    vote.style.top = '-30px';
    vote.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    gameArea.appendChild(vote);
    votes.push(vote);
    
    // Remove vote after animation
    setTimeout(() => {
        if (vote.parentNode) {
            vote.parentNode.removeChild(vote);
            votes = votes.filter(v => v !== vote);
        }
    }, 5000);
}

// Check collisions
function checkCollisions() {
    const playerRect = playerToothless.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    
    votes.forEach((vote, index) => {
        const voteRect = vote.getBoundingClientRect();
        
        // Check if vote is in collision with player
        if (voteRect.left < playerRect.right &&
            voteRect.right > playerRect.left &&
            voteRect.top < playerRect.bottom &&
            voteRect.bottom > playerRect.top) {
            
            // Collision detected!
            score += 10;
            scoreElement.textContent = score;
            
            // Create particle effect
            createParticleEffect(voteRect.left - gameRect.left, voteRect.top - gameRect.top);
            
            // Remove vote
            vote.parentNode.removeChild(vote);
            votes.splice(index, 1);
            
            // Make Toothless happy animation
            playerToothless.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                playerToothless.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
        }
    });
}

// Create particle effect
function createParticleEffect(x, y) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + Math.random() * 20 - 10 + 'px';
        particle.style.top = y + Math.random() * 20 - 10 + 'px';
        
        gameArea.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

// Start game
function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    votes.forEach(vote => {
        if (vote.parentNode) {
            vote.parentNode.removeChild(vote);
        }
    });
    votes = [];
    
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    startGameBtn.style.display = 'none';
    gameOver.classList.remove('show');
    
    // Reset player position
    playerX = gameArea.offsetWidth / 2;
    playerToothless.style.left = playerX - 30 + 'px';
    
    // Start timers
    gameTimer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    spawnTimer = setInterval(createVote, 800);
    
    // Start collision checking
    const collisionCheck = setInterval(() => {
        if (!gameActive) {
            clearInterval(collisionCheck);
            return;
        }
        checkCollisions();
    }, 50);
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(spawnTimer);
    
    finalScore.textContent = score;
    gameOver.classList.add('show');
    
    // Clear remaining votes
    setTimeout(() => {
        votes.forEach(vote => {
            if (vote.parentNode) {
                vote.parentNode.removeChild(vote);
            }
        });
        votes = [];
    }, 1000);
}

// Event listeners
startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Scroll to game section when CTA button is clicked
document.getElementById('startGame').addEventListener('click', () => {
    document.getElementById('gameSection').scrollIntoView({ behavior: 'smooth' });
});

// Vote button animations
const voteButtons = document.querySelectorAll('.vote-btn');
voteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Create celebration effect
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createFloatingHeart(centerX, centerY);
            }, i * 100);
        }
        
        // Show thank you message
        if (button.classList.contains('primary')) {
            button.textContent = '🎉 DZIĘKUJĘ ZA GŁOS!';
            setTimeout(() => {
                button.innerHTML = '✅ GŁOSUJĘ NA SZCZERBATKA';
            }, 3000);
        }
    });
});

// Create floating hearts
function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💚';
    heart.style.position = 'fixed';
    heart.style.left = x + Math.random() * 100 - 50 + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'particleFloat 2s linear forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 2000);
}

// Add some random floating particles
function createRandomParticles() {
    if (Math.random() > 0.98) {
        const particle = document.createElement('div');
        particle.innerHTML = '✨';
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.fontSize = Math.random() * 20 + 10 + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.animation = 'particleFloat 4s linear forwards';
        particle.style.opacity = '0.7';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }
}

// Start random particle generation
setInterval(createRandomParticles, 100);

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add typing effect to hero text
function typeWriter(element, text, speed = 100) {
    element.innerHTML = '';
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroText = document.querySelector('.hero-text');
    const originalText = heroText.textContent;
    typeWriter(heroText, originalText, 50);
});

// Add scroll animations
function animateOnScroll() {
    const cards = document.querySelectorAll('.promise-card');
    cards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            card.style.animationDelay = (index * 0.2) + 's';
            card.classList.add('animate-in');
        }
    });
}

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Run once on load

// Make the page more interactive on mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    cursor.style.display = 'none';
}

// Share functionality
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const closeShare = document.getElementById('closeShare');
const shareUrl = document.getElementById('shareUrl');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyFeedback = document.getElementById('copyFeedback');

// Set current URL
shareUrl.value = window.location.href;

// Show share modal
shareBtn.addEventListener('click', () => {
    shareModal.classList.add('show');
    document.body.style.overflow = 'hidden';
});

// Close share modal
closeShare.addEventListener('click', () => {
    shareModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Copy link functionality
copyLinkBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value);
        copyFeedback.textContent = '✅ Link skopiowany!';
        copyFeedback.classList.add('show');
        
        // Change button text temporarily
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = '✅ Skopiowano!';
        
        setTimeout(() => {
            copyFeedback.classList.remove('show');
            copyLinkBtn.textContent = originalText;
        }, 2000);
        
    } catch (err) {
        // Fallback for older browsers
        shareUrl.select();
        shareUrl.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        copyFeedback.textContent = '✅ Link skopiowany!';
        copyFeedback.classList.add('show');
        
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = '✅ Skopiowano!';
        
        setTimeout(() => {
            copyFeedback.classList.remove('show');
            copyLinkBtn.textContent = originalText;
        }, 2000);
    }
});

// Select all text when clicking on input
shareUrl.addEventListener('click', () => {
    shareUrl.select();
});

// Add sound effects (optional - can be enabled if needed)
function playSound(type) {
    // Simple sound effect using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let frequency;
    
    switch(type) {
        case 'collect':
            frequency = 800;
            break;
        case 'game-over':
            frequency = 200;
            break;
        case 'click':
            frequency = 600;
            break;
        default:
            frequency = 440;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}