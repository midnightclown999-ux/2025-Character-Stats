document.addEventListener('DOMContentLoaded', () => {
    // === SELECTORS ===
    const inputSection = document.getElementById('input-section');
    const outputSection = document.getElementById('output-section');
    const generateBtn = document.getElementById('generateBtn');
    const retryBtn = document.getElementById('retryBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    const nameInput = document.getElementById('charName');
    const photoInput = document.getElementById('charPhoto');
    const previewBox = document.getElementById('previewBox');
    
    // Range Inputs
    const ranges = ['happy', 'busy', 'luck'];
    
    // Outputs
    const displayName = document.getElementById('displayName');
    const displayPhoto = document.getElementById('displayPhoto');
    const rankBadge = document.getElementById('rankBadge');
    
    // Audio
    const bgm = document.getElementById('bgm');
    let musicStarted = false;

    // === MUSIC STARTER ===
    document.body.addEventListener('click', () => {
        if (!musicStarted) {
            bgm.volume = 0.4;
            bgm.play().catch(e => console.log("Audio play error:", e));
            musicStarted = true;
        }
    }, { once: true });

    // === LIVE SLIDER NUMBERS ===
    ranges.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', (e) => {
            document.getElementById(`val-${id}`).innerText = e.target.value;
        });
    });

    // === PHOTO UPLOAD ===
    previewBox.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewBox.style.backgroundImage = `url(${e.target.result})`;
                previewBox.innerText = '';
                displayPhoto.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // === GENERATE BUTTON ===
    generateBtn.addEventListener('click', () => {
        const name = nameInput.value || "UNKNOWN";
        const happy = document.getElementById('happy').value;
        const busy = document.getElementById('busy').value;
        const luck = document.getElementById('luck').value;

        if (!photoInput.files[0]) {
            alert("⚠️ WARNING: NO AVATAR DETECTED!");
            return;
        }

        // 1. Set Text
        displayName.innerText = name;
        document.getElementById('val-happy-out').innerText = happy;
        document.getElementById('val-busy-out').innerText = busy;
        document.getElementById('val-luck-out').innerText = luck;

        // 2. Calculate Rank
        const avg = (parseInt(happy) + parseInt(busy) + parseInt(luck)) / 3;
        let rank = 'B';
        if(avg > 90) rank = 'SSS';
        else if(avg > 80) rank = 'SS';
        else if(avg > 70) rank = 'S';
        else if(avg > 55) rank = 'A';
        
        rankBadge.innerText = rank;

        // 3. Switch Screen
        inputSection.classList.remove('active');
        inputSection.classList.add('hidden');
        outputSection.classList.remove('hidden');
        outputSection.classList.add('active');

        // 4. Animate Bars
        setTimeout(() => {
            document.getElementById('barHappy').style.width = `${happy}%`;
            document.getElementById('barBusy').style.width = `${busy}%`;
            document.getElementById('barLuck').style.width = `${luck}%`;
        }, 300);
    });

    // === RETRY ===
    retryBtn.addEventListener('click', () => {
        outputSection.classList.remove('active');
        outputSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        inputSection.classList.add('active');

        // Reset Bars
        ['barHappy', 'barBusy', 'barLuck'].forEach(id => {
            document.getElementById(id).style.width = '0%';
        });
    });

    // === DOWNLOAD ===
    downloadBtn.addEventListener('click', () => {
        const card = document.querySelector('.character-card');
        
        // Opsi html2canvas untuk hasil lebih tajam
        html2canvas(card, {
            backgroundColor: null,
            scale: 2 // Resolusi 2x lebih tajam
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `FIGHTER-2025-${nameInput.value}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});