document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const inputSection = document.getElementById('input-section');
    const outputSection = document.getElementById('output-section');
    const generateBtn = document.getElementById('generateBtn');
    const retryBtn = document.getElementById('retryBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    const nameInput = document.getElementById('charName');
    const photoInput = document.getElementById('charPhoto');
    const previewBox = document.getElementById('previewBox');
    const previewText = previewBox.querySelector('span');
    
    // Inputs & Outputs
    const ranges = ['happy', 'busy', 'luck'];
    const displayName = document.getElementById('displayName');
    const displayPhoto = document.getElementById('displayPhoto');
    const rankBadge = document.getElementById('rankBadge');
    
    // Audio
    const bgm = document.getElementById('bgm');
    let musicStarted = false;

    // === START MUSIC (ON FIRST INTERACTION) ===
    document.body.addEventListener('click', () => {
        if (!musicStarted) {
            bgm.volume = 0.3; // Volume jangan terlalu keras
            bgm.play().catch(e => console.log("Audio blocked by browser policy", e));
            musicStarted = true;
        }
    }, { once: true });

    // === LIVE SLIDER VALUE UPDATE ===
    ranges.forEach(id => {
        const el = document.getElementById(id);
        const valDisplay = document.getElementById(`val-${id}`);
        el.addEventListener('input', (e) => {
            valDisplay.innerText = e.target.value;
        });
    });

    // === PHOTO UPLOAD HANDLING (FIXED PREVIEW) ===
    previewBox.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Set background image untuk preview
                previewBox.style.backgroundImage = `url(${e.target.result})`;
                // Pastikan posisi center top lewat JS juga
                previewBox.style.backgroundPosition = 'center top';
                // Sembunyikan teks placeholder
                previewText.style.display = 'none';
                // Set source untuk image output nanti
                displayPhoto.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // === GENERATE CARD LOGIC ===
    generateBtn.addEventListener('click', () => {
        const name = nameInput.value.trim() || "UNKNOWN FIGHTER";
        const happy = document.getElementById('happy').value;
        const busy = document.getElementById('busy').value;
        const luck = document.getElementById('luck').value;

        // Validasi Foto Wajib
        if (!photoInput.files[0]) {
            // Efek getar jika lupa foto
            previewBox.style.borderColor = 'red';
            setTimeout(() => previewBox.style.borderColor = '#555', 500);
            alert("⚠️ WARNING: FIGHTER AVATAR REQUIRED!");
            return;
        }

        // 1. Populate Data
        displayName.innerText = name;
        document.getElementById('val-happy-out').innerText = happy;
        document.getElementById('val-busy-out').innerText = busy;
        document.getElementById('val-luck-out').innerText = luck;

        // 2. Calculate Rank (Weighted average for fun)
        // Memberi bobot lebih pada Luck dan Happiness
        const weightedAvg = (parseInt(happy)*1.2 + parseInt(busy)*0.8 + parseInt(luck)*1.1) / 3.1;
        let rank = 'B';
        if(weightedAvg > 92) rank = 'SSS';
        else if(weightedAvg > 82) rank = 'SS';
        else if(weightedAvg > 72) rank = 'S';
        else if(weightedAvg > 58) rank = 'A';
        
        rankBadge.innerText = rank;

        // 3. Switch Screen Animation
        inputSection.classList.remove('active');
        inputSection.classList.add('hidden');
        outputSection.classList.remove('hidden');
        outputSection.classList.add('active');
        
        // Scroll to top of output on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 4. Animate Bars (Delayed for effect)
        setTimeout(() => {
            document.getElementById('barHappy').style.width = `${happy}%`;
            document.getElementById('barBusy').style.width = `${busy}%`;
            document.getElementById('barLuck').style.width = `${luck}%`;
        }, 400);
    });

    // === RETRY LOGIC ===
    retryBtn.addEventListener('click', () => {
        outputSection.classList.remove('active');
        outputSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        inputSection.classList.add('active');

        // Reset Bars Animation
        ['barHappy', 'barBusy', 'barLuck'].forEach(id => {
            document.getElementById(id).style.width = '0%';
        });
    });

    // === DOWNLOAD FEATURE (HIGH QUALITY FOR IG) ===
    downloadBtn.addEventListener('click', () => {
        // Kita capture container pembungkusnya (.capture-area) agar flare background ikut terfoto
        const captureTarget = document.querySelector('.capture-area');
        
        // Visual feedback saat download
        downloadBtn.innerText = "CAPTURING...";
        downloadBtn.disabled = true;

        html2canvas(captureTarget, {
            backgroundColor: '#0a0a14', // Warna background solid agar tidak transparan
            scale: 3, // Scale 3x untuk kualitas tajam di IG
            useCORS: true, // Membantu jika ada masalah gambar cross-origin
            logging: false
        }).then(canvas => {
            // Buat nama file yang bersih
            const cleanName = nameInput.value.replace(/[^a-zA-Z0-9]/g, '');
            
            // Trigger download
            const link = document.createElement('a');
            link.download = `KOF2025-${cleanName || 'FIGHTER'}.jpg`; // Gunakan JPG untuk file lebih kecil tapi kualitas bagus
            link.href = canvas.toDataURL('image/jpeg', 0.9); // Kualitas JPG 90%
            link.click();

            // Reset tombol
            downloadBtn.innerText = "SAVE FOR INSTAGRAM";
            downloadBtn.disabled = false;
        }).catch(err => {
             console.error("Screenshot failed:", err);
             downloadBtn.innerText = "ERROR SAVING";
             downloadBtn.disabled = false;
        });
    });
});