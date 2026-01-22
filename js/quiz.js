'use strict';

/**
 * Navigate to a specific slide number
 * @param {number} slideNumber - Slide number (1-indexed)
 */
function goToSlide(slideNumber) {
    // slideNumber is 1-indexed (as displayed to user), convert to 0-indexed
    const slideIndex = slideNumber - 1;
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        showSlide(slideIndex);
    }
}

// ===== Table of Contents Links =====
// Add click handlers to slide references in table of contents
document.addEventListener('DOMContentLoaded', function () {
    // Find the table of contents slide (slide 2)
    const tocSlide = slides[1]; // index 1 = slide 2

    if (tocSlide) {
        // Get the entire HTML content
        let html = tocSlide.innerHTML;

        // Replace all "(שקף X)" with a clickable span
        html = html.replace(/\(שקף (\d+)\)/g, function (match, slideNum) {
            return '<span class="slide-link-span" data-slide="' + slideNum + '">' + match + '</span>';
        });

        // Update the slide HTML
        tocSlide.innerHTML = html;

        // Add event listeners to all the new spans
        const slideLinks = tocSlide.querySelectorAll('.slide-link-span');
        slideLinks.forEach(link => {
            const slideNum = parseInt(link.getAttribute('data-slide'));

            link.addEventListener('click', function (e) {
                e.stopPropagation();
                goToSlide(slideNum);
            });
        });
    }
});

// ===== Quiz Functionality =====
// Initialize quiz functionality
showSlide(0);

// Add click listener for options
document.addEventListener('DOMContentLoaded', function () {
    // For each question, add listeners for options
    document.querySelectorAll('.question').forEach(question => {
        const answerBox = question.querySelector('.answer-box');
        const options = question.querySelectorAll('.option');
        const showAnswerBtn = question.querySelector('.show-answer-btn');

        // Extract the correct letter from the answer box
        let correctAnswer = '';
        if (answerBox) {
            const answerText = answerBox.innerHTML;
            const match = answerText.match(/תשובה נכונה:\s*([א-ת])/);
            if (match) {
                correctAnswer = match[1];
            }
        }

        // Add listener for each option
        options.forEach(option => {
            const optionLetter = option.querySelector('.option-letter').textContent.trim();

            option.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent navigation in slide

                // If answer already selected, do nothing
                if (option.classList.contains('correct') || option.classList.contains('incorrect')) {
                    return;
                }

                // Check if answer is correct
                if (optionLetter === correctAnswer) {
                    // Correct answer - color green
                    option.classList.add('correct');
                } else {
                    // Wrong answer - color red and open correct answer
                    option.classList.add('incorrect');

                    // Show correct answer
                    if (answerBox) {
                        answerBox.classList.add('show');
                        if (showAnswerBtn) {
                            showAnswerBtn.textContent = 'הסתר תשובה';
                        }
                    }

                    // Mark correct answer in green
                    options.forEach(opt => {
                        const letter = opt.querySelector('.option-letter').textContent.trim();
                        if (letter === correctAnswer) {
                            opt.classList.add('correct');
                        }
                    });
                }
            });
        });
    });
});

/**
 * Toggle answer visibility for quiz questions
 * @param {HTMLElement} button - The button element that was clicked
 * @param {Event} event - The click event
 */
function toggleAnswer(button, event) {
    event.stopPropagation();
    const answerBox = button.nextElementSibling;
    const question = button.closest('.question');
    const options = question.querySelectorAll('.option');

    if (answerBox.classList.contains('show')) {
        // Hide answer - reset question
        answerBox.classList.remove('show');
        button.textContent = 'הצג תשובה';

        // Remove all colors from options
        options.forEach(option => {
            option.classList.remove('correct');
            option.classList.remove('incorrect');
        });
    } else {
        // Show answer
        answerBox.classList.add('show');
        button.textContent = 'הסתר תשובה';
    }
}
