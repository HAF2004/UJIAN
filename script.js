window.addEventListener('load', function() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (!userId || !userName) {
        window.location.href = 'index.html';
        return;
    }
});

document.getElementById('quizForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    const formData = new FormData(event.target);

    // Kunci jawaban pilihan ganda
    const correctAnswers = {
        q1: "Hypertext Transfer Protocol",
        q2: "Memproses data",
        q3: "Windows",
        q4: "Menyimpan data sementara untuk mempercepat pemrosesan",
        q5: "HyperText Markup Language",
        q6: "Modem",
        q7: "Uniform Resource Locator",
        q8: "Kumpulan data yang terorganisir",
        q9: ".docx",
        q10: "Melindungi komputer dari ancaman jaringan",
        q11: "JavaScript",
        q12: "Alamat unik perangkat dalam jaringan",
        q13: "Linux",
        q14: "Modem",
        q15: "PNG"
    };

    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;

    for (let [key, value] of formData.entries()) {
        if (correctAnswers[key] && correctAnswers[key] === value) {
            score++;
        }
    }

    // Menyimpan jawaban essay
    const essays = {
        essay1: formData.get('essay1'),
        essay2: formData.get('essay2'),
        essay3: formData.get('essay3'),
        essay4: formData.get('essay4'),
        essay5: formData.get('essay5')
    };

    // Simpan semua data ke localStorage
    localStorage.setItem('quizScore', score);
    localStorage.setItem('totalQuestions', totalQuestions);
    Object.entries(essays).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });

    // Kirim hasil ke Discord webhook
    sendToDiscord(userId, userName, score, totalQuestions, essays);

    // Redirect ke halaman hasil
    window.location.href = 'result.html';
});

// Fungsi untuk mengirim data ke Discord webhook
function sendToDiscord(userId, userName, score, totalQuestions, essays) {
    const webhookURL = "https://discord.com/api/webhooks/1309913311919214633/1sLO8Gcp2tCEj3_BXEv1jtMOTI89o0fXgeHnquwgowBddYK6WmD1gF9MUQBe74HJp10l";
    const data = {
        content: `${userName}, ${userId}, ${score}/${totalQuestions}, ${essays.essay1 || 'No Answer'}, ${essays.essay2 || 'No Answer'}, ${essays.essay3 || 'No Answer'}, ${essays.essay4 || 'No Answer'}, ${essays.essay5 || 'No Answer'}`
    };
    
    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed to send data to Discord:", response);
        } else {
            console.log("Data sent to Discord successfully.");
        }
    })
    .catch(error => console.error("Error sending data to Discord:", error));
}
