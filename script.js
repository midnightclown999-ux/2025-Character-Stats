// ... (kode sebelumnya tetap sama sampai bagian generateBtn.addEventListener)

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

        // --- NEW: Set nilai angka di samping bar ---
        document.getElementById('val-happy-out').innerText = happyVal;
        document.getElementById('val-busy-out').innerText = busyVal;
        document.getElementById('val-luck-out').innerText = luckVal;
        // -------------------------------------------

        // Hitung Rank (Logic tetap sama)
        const total = parseInt(happyVal) + parseInt(busyVal) + parseInt(luckVal);
        const avg = total / 3;
        let rank = 'C';
        if(avg > 90) rank = 'SSS'; // Sedikit penyesuaian standar rank
        else if(avg > 80) rank = 'SS';
        else if(avg > 70) rank = 'S';
        else if(avg > 60) rank = 'A';
        else if(avg > 40) rank = 'B';
        
        rankBadge.innerText = rank;

        // Animasi Transisi (Tetap sama)
        inputSection.classList.remove('active');
        inputSection.classList.add('hidden');
        outputSection.classList.remove('hidden');
        outputSection.classList.add('active');

        // Animasi Bar (Tetap sama)
        setTimeout(() => {
            barHappy.style.width = `${happyVal}%`;
            barBusy.style.width = `${busyVal}%`;
            barLuck.style.width = `${luckVal}%`;
        }, 300);
    });

// ... (sisa kode retry dan download tetap sama)