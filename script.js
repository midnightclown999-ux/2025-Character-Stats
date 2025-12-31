document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTS ===
    const inputSection = document.getElementById('input-section');
    const outputSection = document.getElementById('output-section');
    const generateBtn = document.getElementById('generateBtn');
    const retryBtn = document.getElementById('retryBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Inputs
    const nameInput = document.getElementById('charName');
    const photoInput = document.getElementById('charPhoto');
    const previewBox = document.getElementById('previewBox');
    
    // Sliders
    const happyRange = document.getElementById('happy');
    const busyRange = document.getElementById('busy');
    const luckRange = document.getElementById('luck');

    // Outputs
    const displayName = document.getElementById('displayName');
    const displayPhoto = document.getElementById('displayPhoto');
    const barHappy = document.getElementById('barHappy');
    const barBusy = document.getElementById('barBusy');
    const barLuck = document.getElementById('barLuck');
    const rankBadge = document.getElementById('rankBadge');
    
    // Audio
    const bgm = document.getElementById('bgm');
    let musicStarted = false;

    // === MUSIC CONTROL ===
    // Browser memblokir autoplay, jadi kita trigger saat user klik pertama kali
    document.body.addEventListener('click', () => {
        if (!musicStarted) {
            bgm.volume = 0.5;
            bgm.play().catch(e => console.log("Audio play failed:", e));
            musicStarted = true;
        }
    }, { once: true });

    // === LIVE PREVIEW SLIDER VALUES ===
    [happyRange, busyRange, luckRange].forEach(range => {
        range.addEventListener('input', (e) => {
            document.getElementById(`val-${e.target.id}`).innerText = e.target.value;
        });
    });

    // === PHOTO PREVIEW ===
    previewBox.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewBox.style.backgroundImage = `url(${e.target.result})`;
                previewBox.innerText = ''; // Hapus teks "No Photo"
                displayPhoto.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // === GENERATE CARD LOGIC ===
    generateBtn.addEventListener('click', () => {
        const name = nameInput.value || "UNKNOWN FIGHTER";
        const happyVal = happyRange.value;
        const busyVal = busyRange.value;
        const luckVal = luckRange.value;

        // Validasi Foto
        if (!photoInput.files[0]) {
            alert("Please choose your fighter avatar!");
            return;
        }

        // Set Text Data
        displayName.innerText = name;

        // Hitung Rank berdasarkan rata-rata statistik
        const total = parseInt(happyVal) + parseInt(busyVal) + parseInt(luckVal);
        const avg = total / 3;
        let rank = 'C';
        if(avg > 85) rank = 'SSS';
        else if(avg > 75) rank = 'S';
        else if(avg > 60) rank = 'A';
        else if(avg > 40) rank = 'B';
        
        rankBadge.innerText = rank;

        // Animasi Transisi
        inputSection.classList.remove('active');
        inputSection.classList.add('hidden');
        outputSection.classList.remove('hidden');
        outputSection.classList.add('active');

        // Animasi Bar (Delay sedikit agar transisi mulus)
        setTimeout(() => {
            barHappy.style.width = `${happyVal}%`;
            barBusy.style.width = `${busyVal}%`;
            barLuck.style.width = `${luckVal}%`;
        }, 300);
    });

    // === RETRY LOGIC ===
    retryBtn.addEventListener('click', () => {
        outputSection.classList.remove('active');
        outputSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        inputSection.classList.add('active');
        
        // Reset Bars animation
        barHappy.style.width = '0%';
        barBusy.style.width = '0%';
        barLuck.style.width = '0%';
    });

    // === DOWNLOAD FEATURE (Optional) ===
    downloadBtn.addEventListener('click', () => {
        const cardElement = document.querySelector('.character-card');
        html2canvas(cardElement).then(canvas => {
            const link = document.createElement('a');
            link.download = `FIGHTER-2025-${nameInput.value}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});