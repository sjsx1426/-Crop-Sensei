document.addEventListener('DOMContentLoaded', () => {
    // --- Crop Prediction Logic ---
    const cropForm = document.getElementById('cropForm');
    const resultDiv = document.getElementById('result');

    cropForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const soil = document.getElementById('soil').value;
        const season = document.getElementById('season').value;
        const location = document.getElementById('location').value.toLowerCase().trim(); // Trim for better matching
        const water = document.getElementById('water').value;

        let predictedCrops = [];
        let adviceMessage = ""; // This will be the message for the chatbot if integrated

        // Data structure for crop recommendations (can be expanded)
        const cropData = {
            black: {
                monsoon: {
                    high: ['Rice', 'Sugarcane', 'Jowar', 'Cotton'],
                    medium: ['Soybean', 'Pulses'],
                    low: ['Maize']
                },
                winter: {
                    high: ['Wheat', 'Barley'],
                    medium: ['Wheat', 'Gram', 'Mustard'],
                    low: ['Sorghum']
                },
                summer: {
                    high: ['Maize', 'Groundnut'],
                    medium: ['Groundnut', 'Sunflower'],
                    low: ['Millets']
                }
            },
            red: {
                monsoon: {
                    high: ['Rice', 'Groundnut'],
                    medium: ['Pulses', 'Groundnut', 'Ragi'],
                    low: ['Millets', 'Bajra']
                },
                winter: {
                    high: ['Wheat', 'Barley'],
                    medium: ['Pulses', 'Oilseeds'],
                    low: ['Sorghum']
                },
                summer: {
                    high: ['Maize'],
                    medium: ['Millets', 'Groundnut'],
                    low: ['Millets']
                }
            },
            clay: {
                monsoon: {
                    high: ['Rice', 'Jute', 'Sugarcane'],
                    medium: ['Wheat', 'Maize'],
                    low: []
                },
                winter: {
                    high: ['Wheat', 'Barley'],
                    medium: ['Wheat', 'Gram'],
                    low: []
                },
                summer: {
                    high: ['Maize'],
                    medium: ['Groundnut'],
                    low: []
                }
            },
            sandy: {
                monsoon: {
                    high: ['Maize', 'Millets'],
                    medium: ['Bajra', 'Pulses'],
                    low: ['Bajra', 'Millets']
                },
                winter: {
                    high: [],
                    medium: ['Barley'],
                    low: ['Sorghum']
                },
                summer: {
                    high: ['Melons'],
                    medium: ['Groundnut', 'Cucumbers'],
                    low: ['Bajra', 'Melons']
                }
            }
        };

        // Get general recommendations
        if (cropData[soil] && cropData[soil][season] && cropData[soil][season][water]) {
            predictedCrops = [...cropData[soil][season][water]]; // Copy to avoid modifying original array
        }

        // Add location-specific crops (examples for India)
        if (location.includes('tamil nadu')) {
            if (soil === 'black' && season === 'monsoon' && water === 'high') predictedCrops.push('Cotton', 'Paddy');
            if (soil === 'red' && season === 'monsoon') predictedCrops.push('Groundnut', 'Millets');
        } else if (location.includes('maharashtra')) {
            if (soil === 'black' && season === 'monsoon') predictedCrops.push('Cotton', 'Soybean', 'Sugarcane');
            if (soil === 'black' && season === 'winter') predictedCrops.push('Jowar', 'Wheat');
        } else if (location.includes('karnataka')) {
            if (soil === 'red' && season === 'monsoon') predictedCrops.push('Ragi', 'Jowar', 'Pulses');
        } else if (location.includes('andhra pradesh') || location.includes('telangana')) {
             if (soil === 'red' && season === 'monsoon') predictedCrops.push('Groundnut', 'Chilli');
        } else if (location.includes('punjab') || location.includes('haryana')) {
            if (soil === 'clay' || soil === 'black') {
                if (season === 'winter' && water === 'medium') predictedCrops.push('Wheat');
                if (season === 'monsoon' && water === 'high') predictedCrops.push('Rice');
            }
        } else if (location.includes('uttar pradesh')) {
            if (soil === 'clay' || soil === 'black') {
                if (season === 'winter' && water === 'medium') predictedCrops.push('Wheat', 'Sugarcane');
                if (season === 'monsoon' && water === 'high') predictedCrops.push('Rice');
            }
        } else if (location.includes('rajasthan')) {
            if (soil === 'sandy' && water === 'low') predictedCrops.push('Bajra', 'Pulses', 'Guar');
            if (soil === 'red' && season === 'monsoon') predictedCrops.push('Maize');
        }


        // Remove duplicates and sort for cleaner output
        predictedCrops = [...new Set(predictedCrops)].sort();

        // --- Display Output ---
        if (predictedCrops.length > 0) {
            resultDiv.innerHTML = `<h3>Recommended Crops for Your Conditions:</h3><p>${predictedCrops.join(', ')}</p>`;
            adviceMessage = `Based on your selections (Soil: ${soil}, Season: ${season}, Location: ${location || 'N/A'}, Water: ${water}), some recommended crops are: ${predictedCrops.join(', ')}.`;
        } else {
            resultDiv.innerHTML = `<h3>No specific recommendations found.</h3><p>Try adjusting your criteria or consult with a local agricultural expert.</p>`;
            adviceMessage = "I couldn't find specific crop recommendations for these conditions. Please try adjusting your parameters or consult with a local agricultural expert for more tailored advice.";
        }

        // Optional: Trigger chatbot with advice if open
        // This is a basic example. In a real scenario, you might send this to a chatbot API.
        if (chatbotContainer.classList.contains('active')) {
            addMessageToChat('bot', adviceMessage);
        }
    });

    // --- AI Chatbot Logic (Placeholder) ---
    const openChatButton = document.getElementById('openChat');
    const closeChatButton = document.getElementById('closeChat');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendChatButton = document.getElementById('sendChat');

    openChatButton.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
        openChatButton.style.display = 'none'; // Hide the "Chat with AI" button
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
    });

    closeChatButton.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
        openChatButton.style.display = 'flex'; // Show the "Chat with AI" button again
    });

    sendChatButton.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to the latest message
    }

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;

        addMessageToChat('user', userMessage);
        chatbotInput.value = ''; // Clear input

        // --- Simulate AI Response (THIS IS WHERE YOU'D INTEGRATE A REAL API) ---
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            addMessageToChat('bot', botResponse);
        }, 500); // Simulate network delay
    }

    // Very basic, rule-based chatbot for demonstration
    function getBotResponse(message) {
        message = message.toLowerCase();

        if (message.includes('hello') || message.includes('hi')) {
            return "Hello there! How can I assist you with your farming queries today?";
        } else if (message.includes('crop sensei') || message.includes('what can you do')) {
            return "I can help you predict the best crops based on soil, season, location, and water availability. I can also answer general farming questions!";
        } else if (message.includes('paddy') || message.includes('rice')) {
            return "Paddy (rice) requires ample water and is typically grown in the monsoon season, especially in regions with high rainfall or good irrigation. Clay and black soils are generally suitable.";
        } else if (message.includes('wheat')) {
            return "Wheat is a major rabi crop grown in winter. It prefers well-drained loamy to clayey soils and moderate water availability.";
        } else if (message.includes('soil type')) {
            return "Common soil types in India include Black, Red, Clay, and Sandy soils, each suitable for different crops.";
        } else if (message.includes('water') || message.includes('irrigation')) {
            return "Water availability is crucial. High water is ideal for paddy, while millets and some pulses do well with low water. Efficient irrigation practices are key.";
        } else if (message.includes('thank you') || message.includes('thanks')) {
            return "You're welcome! Happy farming!";
        } else if (message.includes('location')) {
             return "Please tell me a specific Indian state or region, and I might have more tailored advice for crops there!";
        } else {
            return "I'm still learning! Could you please rephrase your question, or ask something more specific about crops or farming conditions?";
        }
    }
});