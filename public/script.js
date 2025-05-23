document.getElementById('sajuForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;
    const gender = document.getElementById('gender').value;
    const question = document.getElementById('question').value;
    const streamingResultElement = document.getElementById('streamingResult');

    streamingResultElement.textContent = 'Loading...';

    // Basic validation (more can be added)
    if (!/^\d{8}$/.test(birthdate)) {
        streamingResultElement.textContent = 'Error: Birthday must be in YYYYMMDD format.';
        return;
    }
    if (!/^\d{4}$/.test(birthtime)) {
        streamingResultElement.textContent = 'Error: Birth time must be in HHMM format.';
        return;
    }
    if (!question.trim()) {
        streamingResultElement.textContent = 'Error: Saju question cannot be empty.';
        return;
    }

    const birthday = birthdate + birthtime; // Combine for API

    try {
        const response = await fetch('/api/saju', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                birthday: birthday,
                gender: gender,
                question: question,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            streamingResultElement.textContent = `Error: ${response.status} ${response.statusText} - ${errorData.error || 'Failed to fetch from API'}`;
            return;
        }

        streamingResultElement.textContent = ''; // Clear loading/previous message
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            streamingResultElement.textContent += chunk;
        }

    } catch (error) {
        console.error('Error fetching Saju data:', error);
        streamingResultElement.textContent = `An error occurred: ${error.message}`;
    }
});