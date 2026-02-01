document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const charCount = document.getElementById('char-count');
    const sentimentBadge = document.getElementById('sentiment-badge');
    const polarityValue = document.getElementById('polarity-value');
    const subjectivityValue = document.getElementById('subjectivity-value');
    const polarityBar = document.getElementById('polarity-bar');
    const subjectivityBar = document.getElementById('subjectivity-bar');
    const interpretationText = document.getElementById('interpretation-text');
    const sampleButtons = document.querySelectorAll('.sample-btn');
    
    // Update character count
    textInput.addEventListener('input', function() {
        charCount.textContent = textInput.value.length;
    });
    
    // Clear text area
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        charCount.textContent = '0';
        resetResults();
    });
    
    // Sample buttons
    sampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            textInput.value = this.getAttribute('data-text');
            charCount.textContent = textInput.value.length;
        });
    });
    
    // Analyze sentiment
    analyzeBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Show loading state
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        analyzeBtn.disabled = true;
        
        // Send request to Flask backend
        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            // Update UI with results
            updateResults(data);
            
            // Reset button state
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Sentiment';
            analyzeBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while analyzing the text. Please try again.');
            
            // Reset button state
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Sentiment';
            analyzeBtn.disabled = false;
        });
    });
    
    // Reset results to default
    function resetResults() {
        sentimentBadge.className = 'sentiment-badge neutral';
        sentimentBadge.innerHTML = '<i class="fas fa-meh"></i> <span>Neutral</span>';
        
        polarityValue.textContent = '0.000';
        subjectivityValue.textContent = '0.000';
        
        polarityBar.style.width = '50%';
        subjectivityBar.style.width = '50%';
        
        interpretationText.textContent = 'Enter text above to see sentiment interpretation.';
    }
    
    // Update UI with analysis results
    function updateResults(data) {
        const { sentiment, polarity, subjectivity, color } = data;
        
        // Update sentiment badge
        sentimentBadge.className = `sentiment-badge ${sentiment.toLowerCase()}`;
        
        let icon = 'fa-meh';
        if (sentiment === 'Positive') icon = 'fa-smile';
        if (sentiment === 'Negative') icon = 'fa-frown';
        
        sentimentBadge.innerHTML = `<i class="fas ${icon}"></i> <span>${sentiment}</span>`;
        
        // Update polarity and subjectivity values
        polarityValue.textContent = polarity.toFixed(3);
        subjectivityValue.textContent = subjectivity.toFixed(3);
        
        // Update polarity bar (polarity ranges from -1 to 1, so we map to 0-100%)
        const polarityPercent = ((polarity + 1) / 2) * 100;
        polarityBar.style.width = `${polarityPercent}%`;
        
        // Update subjectivity bar (subjectivity ranges from 0 to 1)
        const subjectivityPercent = subjectivity * 100;
        subjectivityBar.style.width = `${subjectivityPercent}%`;
        
        // Update interpretation text
        let interpretation = '';
        
        // Polarity interpretation
        if (polarity > 0.5) {
            interpretation += 'The text is strongly positive. ';
        } else if (polarity > 0.1) {
            interpretation += 'The text is positive. ';
        } else if (polarity > -0.1) {
            interpretation += 'The text is neutral. ';
        } else if (polarity > -0.5) {
            interpretation += 'The text is negative. ';
        } else {
            interpretation += 'The text is strongly negative. ';
        }
        
        // Subjectivity interpretation
        if (subjectivity > 0.7) {
            interpretation += 'It is highly subjective, expressing personal opinions and emotions.';
        } else if (subjectivity > 0.4) {
            interpretation += 'It is somewhat subjective, with a mix of facts and opinions.';
        } else if (subjectivity > 0.1) {
            interpretation += 'It is somewhat objective, leaning toward factual information.';
        } else {
            interpretation += 'It is highly objective, primarily stating facts.';
        }
        
        interpretationText.textContent = interpretation;
    }
    
    // Initialize character count
    charCount.textContent = textInput.value.length;
    
    // Allow Enter key to trigger analysis (with Ctrl/Cmd)
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            analyzeBtn.click();
        }
    });
});