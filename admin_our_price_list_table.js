// Admin Security Panel – hosszú jobb klikk / érintés aktiválás
let StartReCountDown = false;

(function() {
    const adminPanel = document.getElementById('admin-security-panel');
    const saveBtn = document.getElementById('admin-save-btn');
    const exitBtn = document.getElementById('admin-exit-btn');

    if (!adminPanel || !saveBtn || !exitBtn) {
        console.warn('Admin panel elemek nem találhatók.');
        return;
    }

    let pressTimer = null;
    let longPressActivated = false; // Flag: elértük-e a 8 másodpercet
    const MIN_PRESS = 3000; // 3-4 másodperc
    
    let countdownInterval; // Fontos: kívül legyen, hogy minden függvény lássa
    

    // --- Jobb egérgomb események ---
    document.addEventListener('mousedown', function(e) {
        if (e.button !== 2) return; // csak jobb gomb
        // Nem hívunk preventDefault-ot, mert a böngésző menüjét csak akkor blokkoljuk, ha aktiválódott
        startPress();
    });

    document.addEventListener('mouseup', function(e) {
        if (e.button !== 2) return;
        cancelPress();
    });

    // --- Érintés események (tablet / mobil) ---
    document.addEventListener('touchstart', function(e) {
        startPress();
    });

    document.addEventListener('touchend', function(e) {
        cancelPress();
    });

    document.addEventListener('touchcancel', function(e) {
        cancelPress();
    });

    function startPress() {
        if (pressTimer) return;
        longPressActivated = false; // új nyomásnál alaphelyzet
        pressTimer = setTimeout(() => {
            longPressActivated = true; // jelezzük, hogy aktiválódott
            if (adminPanel.style.display !== 'block') {
                showAdminPanel();
            }
        }, MIN_PRESS);
    }

    function cancelPress() {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
        // Ha nem aktiválódott a hosszú nyomás, akkor nem csinálunk semmit,
        // így a böngésző a saját menüjét fogja megjeleníteni.
    }

    // Contextmenu esemény – itt döntjük el, hogy blokkoljuk-e
    document.addEventListener('contextmenu', function(e) {
        if (longPressActivated) {
            e.preventDefault(); // ha aktiválódott a panel, akkor blokkoljuk a menüt
        }
        // Különben hagyjuk, hogy a böngésző megjelenítse a saját menüjét
    });

    function showAdminPanel() {
        gsap.set(adminPanel, {
            display: 'block',
            y: '-100%',
            opacity: 0
        });
        gsap.to(adminPanel, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    function hideAdminPanel() {
        gsap.to(adminPanel, {
            y: '-100%',
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                adminPanel.style.display = 'none';
            }
        });
    }

    // --- Gombok eseménykezelői ---
    exitBtn.addEventListener('click', function() {
        hideAdminPanel();
    });

    saveBtn.addEventListener('click', function() {
        console.log('💾 Mentés gomb megnyomva');
        // Ide jön majd a mentési logika
    });
})();


// Menüpontok kezelése (lenyitás/zárás)
document.querySelectorAll('.menu-main-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const targetId = this.dataset.target;
        if (!targetId) return; // ha nincs target, nem csinál semmit

        const submenu = document.getElementById(targetId);
        const isVisible = submenu.style.display === 'block';

        // Először az összes almenüt bezárjuk (opcionális)
        document.querySelectorAll('.submenu').forEach(s => s.style.display = 'none');

        // Ha nem volt látható, megnyitjuk
        if (!isVisible) {
            submenu.style.display = 'block';
        }
    });
});


// Visszaszámláló függvény First period
function startCountdown_1(seconds) {
    const timerDisplay = document.getElementById('countdown-timer');
    const step1        = document.getElementById('step1');
    const step2        = document.getElementById('step2');
    const statusDiv    = document.getElementById('permission-status');
    const errorDiv     = document.getElementById('mobile-error');
    const Send_B       = document.getElementById('send-mobile-btn');
    const Resend_B     = document.getElementById('resend-code-btn');

    let timeLeft = seconds;
    //clearInterval(countdownInterval); // Előző takarítása
    timerDisplay.style.display = 'block';

    countdownInterval = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        
        timerDisplay.textContent = `Time remaining: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // RESET: Idő lejárt
            timerDisplay.style.display = 'none';
            step2.style.display        = 'none'; // VERIFY TURN OFF
            step1.style.display        = 'flex'; // MOBILE ENTERED
            Resend_B.style.display     = 'block';
            Send_B.style.display       = 'none';
            statusDiv.textContent      = '';
            errorDiv.textContent       = 'Time expired! Please request a new code.';
            document.getElementById('mobile-input').value = ''; // Mező ürítése
            StartReCountDown = true;
            
        }
        timeLeft--;
    }, 1000);
}


// Visszaszámláló függvény Second period
function startCountdown_2(seconds) {
    const timerDisplay3 = document.getElementById('countdown-timer');
    const step1     = document.getElementById('step1');
    const step2     = document.getElementById('step2');
    const statusDiv = document.getElementById('permission-status');
    const errorDiv  = document.getElementById('mobile-error');


    let timeLeft = seconds;
    clearInterval(countdownInterval); // Előző takarítása
    
    step2.style.display = 'flex';
    step1.style.display = 'none';
    
    timerDisplay3.style.display = 'block';


    countdownInterval = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        
        timerDisplay3.textContent = `Time remaining: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // RESET: Idő lejárt
            timerDisplay3.style.display = 'none';
            step2.style.display = 'none';
            step1.style.display = 'none';
            statusDiv.textContent = '';
            errorDiv.textContent = 'Time expired! Please refress the website.';
            document.getElementById('mobile-input').value = ''; // Mező ürítése
            StartReCountDown = false;
        }
        timeLeft--;
    }, 1000);
}


// 1. lépés: mobilszám elküldése
document.getElementById('send-mobile-btn').addEventListener('click', function() {
    const mobile = document.getElementById('mobile-input').value.trim();
    const errorDiv = document.getElementById('mobile-error');
    const statusDiv = document.getElementById('permission-status');

    // Egyszerű validáció (csak nem üres)
    if (!mobile) {
        errorDiv.textContent = 'Please enter a mobile number.';
        return;
    }
    errorDiv.textContent = '';

    // AJAX hívás a szerverre
    fetch('/includes/php/admin_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'requestCode', mobile: mobile })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Ha sikeres, elrejtjük az 1. lépést, megjelenítjük a 2. lépést
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'flex';
            statusDiv.textContent = 'Verification code sent to your email.You have 2 minute to enter the code.';
            statusDiv.style.color = '#4caf50';

            if(StartReCountDown == false) {
                startCountdown_1(120); // function what start to count back from 60 second
            }

        } else {
            errorDiv.textContent = data.error || 'Unknown error.';
        }
    })
    .catch(err => {
        errorDiv.textContent = 'Network error.';
        console.error(err);
    });
});



// 2. Lépés: VERIFY gomb
document.getElementById('verify-code-btn').addEventListener('click', function() {
    const code = document.getElementById('code-input').value.trim().toUpperCase();
    const mobile = document.getElementById('mobile-input').value.trim();
    const errorDiv = document.getElementById('code-error');
    const statusDiv = document.getElementById('permission-status');
    const timerDisplay2 = document.getElementById('countdown-timer');


    if (!code || code.length !== 8) {
        errorDiv.textContent = 'Please enter the 8-character code.';
        return;
    }
    errorDiv.textContent = '';

    fetch('/includes/php/admin_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verifyCode', mobile: mobile, code: code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
            clearInterval(countdownInterval);
            timerDisplay2.style.display = 'none';
            
            statusDiv.textContent = 'Access granted! Role: ' + data.role;
            statusDiv.style.color = '#4caf50';

            // Értesítés a sikeres belépésről
            if (typeof window.showNotification === 'function') {
                window.showNotification('✅ Access granted! Role: ' + data.role, 'success');
            }


            // Jogosultságok beállítása...
            if (data.role === 'admin') {
                document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('inactive'));
            } else if (data.role === 'operator') {
                // Operátor esetén csak a PRICE PLAN és WEBSHOP aktív
                document.querySelectorAll('.menu-item').forEach(item => item.classList.add('inactive'));
                // Itt majd specifikusan aktiváljuk a megfelelőket
            }

            document.getElementById('step2').style.display = 'none';
        } else {
            errorDiv.textContent = data.error || 'Invalid code.';
            if (typeof window.showNotification === 'function') {
                window.showNotification('❌ ' + (data.error || 'Invalid code.'), 'error');
            }
        }
    })
    .catch(err => {
        errorDiv.textContent = 'Network error.';
        console.error(err);
        if (typeof window.showNotification === 'function') {
            window.showNotification('❌ Network error.', 'error');
        }
    });
});


document.getElementById('resend-code-btn').addEventListener('click', function() {
    const mobile = document.getElementById('mobile-input').value.trim();
    const errorDiv = document.getElementById('code-error');
    const statusDiv = document.getElementById('permission-status');

    // Vizuális visszajelzés, hogy elindult a folyamat
    this.disabled = true;
    this.textContent = 'SENDING...';

    fetch('/includes/php/admin_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'requestCode', mobile: mobile })
    })
    .then(response => response.json())
    .then(data => {
        this.disabled = false;
        this.textContent = 'RESEND';

        if (data.success) {
            errorDiv.textContent = '';
            statusDiv.textContent = 'New verification code sent! Timer reset.';
            statusDiv.style.color = '#4caf50';

            // Újraindítjuk a visszaszámlálót 5 percről

            startCountdown_2(300); // 300 SEC ENOUGH, IF NOT SUCCES YOU NEED TO RELOAD THE WEBSITE
            
            // Értesítés, ha van ilyen függvényed
            if (typeof window.showNotification === 'function') {
                window.showNotification('✅ New code sent!', 'success');
            }
        } else {
            errorDiv.textContent = data.error || 'Failed to resend code.';
        }
    })
    .catch(err => {
        this.disabled = false;
        this.textContent = 'RESEND';
        errorDiv.textContent = 'Network error during resend.';
        console.error(err);
    });
});


// IP COUNTRY BLOCKING

// Csak akkor fut, ha az adott menü aktív lesz
function initCountryDropdown() {
    const dropdownContainer = document.getElementById('country-dropdown');
    if (!dropdownContainer) return;

    // Országok listája a jSuites példából (kibővítve a szükséges mezőkkel)
    
    const countries = [
        { "text": "Afghanistan", "value": "AF" },
        { "text": "Åland Islands", "value": "AX" },
        { "text": "Albania", "value": "AL" },
        { "text": "Algeria", "value": "DZ" },
        { "text": "American Samoa", "value": "AS" },
        { "text": "Andorra", "value": "AD" },
        { "text": "Angola", "value": "AO" },
        { "text": "Anguilla", "value": "AI" },
        { "text": "Antarctica", "value": "AQ" },
        { "text": "Antigua and Barbuda", "value": "AG" },
        { "text": "Argentina", "value": "AR" },
        { "text": "Armenia", "value": "AM" },
        { "text": "Aruba", "value": "AW" },
        { "text": "Australia", "value": "AU" },
        { "text": "Austria", "value": "AT" },
        { "text": "Azerbaijan", "value": "AZ" },
        { "text": "Bahamas", "value": "BS" },
        { "text": "Bahrain", "value": "BH" },
        { "text": "Bangladesh", "value": "BD" },
        { "text": "Barbados", "value": "BB" },
        { "text": "Belarus", "value": "BY" },
        { "text": "Belgium", "value": "BE" },
        { "text": "Belize", "value": "BZ" },
        { "text": "Benin", "value": "BJ" },
        { "text": "Bermuda", "value": "BM" },
        { "text": "Bhutan", "value": "BT" },
        { "text": "Bolivia", "value": "BO" },
        { "text": "Bosnia and Herzegovina", "value": "BA" },
        { "text": "Botswana", "value": "BW" },
        { "text": "Bouvet Island", "value": "BV" },
        { "text": "Brazil", "value": "BR" },
        { "text": "British Indian Ocean Territory", "value": "IO" },
        { "text": "Brunei Darussalam", "value": "BN" },
        { "text": "Bulgaria", "value": "BG" },
        { "text": "Burkina Faso", "value": "BF" },
        { "text": "Burundi", "value": "BI" },
        { "text": "Cambodia", "value": "KH" },
        { "text": "Cameroon", "value": "CM" },
        { "text": "Canada", "value": "CA" },
        { "text": "Cape Verde", "value": "CV" },
        { "text": "Cayman Islands", "value": "KY" },
        { "text": "Central African Republic", "value": "CF" },
        { "text": "Chad", "value": "TD" },
        { "text": "Chile", "value": "CL" },
        { "text": "China", "value": "CN" },
        { "text": "Christmas Island", "value": "CX" },
        { "text": "Cocos (Keeling) Islands", "value": "CC" },
        { "text": "Colombia", "value": "CO" },
        { "text": "Comoros", "value": "KM" },
        { "text": "Congo", "value": "CG" },
        { "text": "Congo, The Democratic Republic of the", "value": "CD" },
        { "text": "Cook Islands", "value": "CK" },
        { "text": "Costa Rica", "value": "CR" },
        { "text": "Cote D'Ivoire", "value": "CI" },
        { "text": "Croatia", "value": "HR" },
        { "text": "Cuba", "value": "CU" },
        { "text": "Cyprus", "value": "CY" },
        { "text": "Czech Republic", "value": "CZ" },
        { "text": "Denmark", "value": "DK" },
        { "text": "Djibouti", "value": "DJ" },
        { "text": "Dominica", "value": "DM" },
        { "text": "Dominican Republic", "value": "DO" },
        { "text": "Ecuador", "value": "EC" },
        { "text": "Egypt", "value": "EG" },
        { "text": "El Salvador", "value": "SV" },
        { "text": "Equatorial Guinea", "value": "GQ" },
        { "text": "Eritrea", "value": "ER" },
        { "text": "Estonia", "value": "EE" },
        { "text": "Ethiopia", "value": "ET" },
        { "text": "Falkland Islands (Malvinas)", "value": "FK" },
        { "text": "Faroe Islands", "value": "FO" },
        { "text": "Fiji", "value": "FJ" },
        { "text": "Finland", "value": "FI" },
        { "text": "France", "value": "FR" },
        { "text": "French Guiana", "value": "GF" },
        { "text": "French Polynesia", "value": "PF" },
        { "text": "French Southern Territories", "value": "TF" },
        { "text": "Gabon", "value": "GA" },
        { "text": "Gambia", "value": "GM" },
        { "text": "Georgia", "value": "GE" },
        { "text": "Germany", "value": "DE" },
        { "text": "Ghana", "value": "GH" },
        { "text": "Gibraltar", "value": "GI" },
        { "text": "Greece", "value": "GR" },
        { "text": "Greenland", "value": "GL" },
        { "text": "Grenada", "value": "GD" },
        { "text": "Guadeloupe", "value": "GP" },
        { "text": "Guam", "value": "GU" },
        { "text": "Guatemala", "value": "GT" },
        { "text": "Guernsey", "value": "GG" },
        { "text": "Guinea", "value": "GN" },
        { "text": "Guinea-Bissau", "value": "GW" },
        { "text": "Guyana", "value": "GY" },
        { "text": "Haiti", "value": "HT" },
        { "text": "Heard Island and Mcdonald Islands", "value": "HM" },
        { "text": "Holy See (Vatican City State)", "value": "VA" },
        { "text": "Honduras", "value": "HN" },
        { "text": "Hong Kong", "value": "HK" },
        { "text": "Hungary", "value": "HU" },
        { "text": "Iceland", "value": "IS" },
        { "text": "India", "value": "IN" },
        { "text": "Indonesia", "value": "ID" },
        { "text": "Iran, Islamic Republic Of", "value": "IR" },
        { "text": "Iraq", "value": "IQ" },
        { "text": "Ireland", "value": "IE" },
        { "text": "Isle of Man", "value": "IM" },
        { "text": "Israel", "value": "IL" },
        { "text": "Italy", "value": "IT" },
        { "text": "Jamaica", "value": "JM" },
        { "text": "Japan", "value": "JP" },
        { "text": "Jersey", "value": "JE" },
        { "text": "Jordan", "value": "JO" },
        { "text": "Kazakhstan", "value": "KZ" },
        { "text": "Kenya", "value": "KE" },
        { "text": "Kiribati", "value": "KI" },
        { "text": "Korea, Democratic People'S Republic of", "value": "KP" },
        { "text": "Korea, Republic of", "value": "KR" },
        { "text": "Kuwait", "value": "KW" },
        { "text": "Kyrgyzstan", "value": "KG" },
        { "text": "Lao People'S Democratic Republic", "value": "LA" },
        { "text": "Latvia", "value": "LV" },
        { "text": "Lebanon", "value": "LB" },
        { "text": "Lesotho", "value": "LS" },
        { "text": "Liberia", "value": "LR" },
        { "text": "Libyan Arab Jamahiriya", "value": "LY" },
        { "text": "Liechtenstein", "value": "LI" },
        { "text": "Lithuania", "value": "LT" },
        { "text": "Luxembourg", "value": "LU" },
        { "text": "Macao", "value": "MO" },
        { "text": "Macedonia, The Former Yugoslav Republic of", "value": "MK" },
        { "text": "Madagascar", "value": "MG" },
        { "text": "Malawi", "value": "MW" },
        { "text": "Malaysia", "value": "MY" },
        { "text": "Maldives", "value": "MV" },
        { "text": "Mali", "value": "ML" },
        { "text": "Malta", "value": "MT" },
        { "text": "Marshall Islands", "value": "MH" },
        { "text": "Martinique", "value": "MQ" },
        { "text": "Mauritania", "value": "MR" },
        { "text": "Mauritius", "value": "MU" },
        { "text": "Mayotte", "value": "YT" },
        { "text": "Mexico", "value": "MX" },
        { "text": "Micronesia, Federated States of", "value": "FM" },
        { "text": "Moldova, Republic of", "value": "MD" },
        { "text": "Monaco", "value": "MC" },
        { "text": "Mongolia", "value": "MN" },
        { "text": "Montserrat", "value": "MS" },
        { "text": "Morocco", "value": "MA" },
        { "text": "Mozambique", "value": "MZ" },
        { "text": "Myanmar", "value": "MM" },
        { "text": "Namibia", "value": "NA" },
        { "text": "Nauru", "value": "NR" },
        { "text": "Nepal", "value": "NP" },
        { "text": "Netherlands", "value": "NL" },
        { "text": "Netherlands Antilles", "value": "AN" },
        { "text": "New Caledonia", "value": "NC" },
        { "text": "New Zealand", "value": "NZ" },
        { "text": "Nicaragua", "value": "NI" },
        { "text": "Niger", "value": "NE" },
        { "text": "Nigeria", "value": "NG" },
        { "text": "Niue", "value": "NU" },
        { "text": "Norfolk Island", "value": "NF" },
        { "text": "Northern Mariana Islands", "value": "MP" },
        { "text": "Norway", "value": "NO" },
        { "text": "Oman", "value": "OM" },
        { "text": "Pakistan", "value": "PK" },
        { "text": "Palau", "value": "PW" },
        { "text": "Palestinian Territory, Occupied", "value": "PS" },
        { "text": "Panama", "value": "PA" },
        { "text": "Papua New Guinea", "value": "PG" },
        { "text": "Paraguay", "value": "PY" },
        { "text": "Peru", "value": "PE" },
        { "text": "Philippines", "value": "PH" },
        { "text": "Pitcairn", "value": "PN" },
        { "text": "Poland", "value": "PL" },
        { "text": "Portugal", "value": "PT" },
        { "text": "Puerto Rico", "value": "PR" },
        { "text": "Qatar", "value": "QA" },
        { "text": "Reunion", "value": "RE" },
        { "text": "Romania", "value": "RO" },
        { "text": "Russian Federation", "value": "RU" },
        { "text": "RWANDA", "value": "RW" },
        { "text": "Saint Helena", "value": "SH" },
        { "text": "Saint Kitts and Nevis", "value": "KN" },
        { "text": "Saint Lucia", "value": "LC" },
        { "text": "Saint Pierre and Miquelon", "value": "PM" },
        { "text": "Saint Vincent and the Grenadines", "value": "VC" },
        { "text": "Samoa", "value": "WS" },
        { "text": "San Marino", "value": "SM" },
        { "text": "Sao Tome and Principe", "value": "ST" },
        { "text": "Saudi Arabia", "value": "SA" },
        { "text": "Senegal", "value": "SN" },
        { "text": "Serbia and Montenegro", "value": "CS" },
        { "text": "Seychelles", "value": "SC" },
        { "text": "Sierra Leone", "value": "SL" },
        { "text": "Singapore", "value": "SG" },
        { "text": "Slovakia", "value": "SK" },
        { "text": "Slovenia", "value": "SI" },
        { "text": "Solomon Islands", "value": "SB" },
        { "text": "Somalia", "value": "SO" },
        { "text": "South Africa", "value": "ZA" },
        { "text": "South Georgia and the South Sandwich Islands", "value": "GS" },
        { "text": "Spain", "value": "ES" },
        { "text": "Sri Lanka", "value": "LK" },
        { "text": "Sudan", "value": "SD" },
        { "text": "Suriname", "value": "SR" },
        { "text": "Svalbard and Jan Mayen", "value": "SJ" },
        { "text": "Swaziland", "value": "SZ" },
        { "text": "Sweden", "value": "SE" },
        { "text": "Switzerland", "value": "CH" },
        { "text": "Syrian Arab Republic", "value": "SY" },
        { "text": "Taiwan, Province of China", "value": "TW" },
        { "text": "Tajikistan", "value": "TJ" },
        { "text": "Tanzania, United Republic of", "value": "TZ" },
        { "text": "Thailand", "value": "TH" },
        { "text": "Timor-Leste", "value": "TL" },
        { "text": "Togo", "value": "TG" },
        { "text": "Tokelau", "value": "TK" },
        { "text": "Tonga", "value": "TO" },
        { "text": "Trinidad and Tobago", "value": "TT" },
        { "text": "Tunisia", "value": "TN" },
        { "text": "Turkey", "value": "TR" },
        { "text": "Turkmenistan", "value": "TM" },
        { "text": "Turks and Caicos Islands", "value": "TC" },
        { "text": "Tuvalu", "value": "TV" },
        { "text": "Uganda", "value": "UG" },
        { "text": "Ukraine", "value": "UA" },
        { "text": "United Arab Emirates", "value": "AE" },
        { "text": "United Kingdom", "value": "GB" },
        { "text": "United States", "value": "US", synonym: ['USA','United States of America'] },
        { "text": "United States Minor Outlying Islands", "value": "UM" },
        { "text": "Uruguay", "value": "UY" },
        { "text": "Uzbekistan", "value": "UZ" },
        { "text": "Vanuatu", "value": "VU" },
        { "text": "Venezuela", "value": "VE" },
        { "text": "Viet Nam", "value": "VN" },
        { "text": "Virgin Islands, British", "value": "VG" },
        { "text": "Virgin Islands, U.S.", "value": "VI" },
        { "text": "Wallis and Futuna", "value": "WF" },
        { "text": "Western Sahara", "value": "EH" },
        { "text": "Yemen", "value": "YE" },
        { "text": "Zambia", "value": "ZM" },
        { "text": "Zimbabwe", "value": "ZW" }
    ];


    // Zászlók hozzáadása a CDN-ről
    for (let i = 0; i < countries.length; i++) {
        countries[i].image = 'https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/' + countries[i].value.toLowerCase() + '.svg';
    }
    
    // Inicializáljuk a dropdown-ot
    const dropdown = jSuites.dropdown(dropdownContainer, {
        data: countries,
        autocomplete: true,
        multiple: true,
        width: '1400px',
        onchange: function(el, val, oldVal, obj) {
            console.log('Kiválasztott országok:', val); 
        }
    });

    
    // Adatok betöltése az adatbázisból (pl. AJAX hívás)
    fetch('/includes/php/get_country_blocks.php')
        .then(response => response.json())
        .then(data => {
            // data pl. ['AF', 'US', 'GB'] a blokkolt országkódok
            dropdown.setValue(data); // beállítja a pipákat
        });

    // Mentés gomb eseménykezelő
    document.getElementById('save-country-blocking').addEventListener('click', function() {
        let selected = dropdown.getValue(); // visszaadja a kiválasztott értékeket (országkódok)
        
        
        // FIX: Convert string to array if needed
    if (typeof selected === 'string' && selected.length > 0) {
         selected = selected.split(/[;,]/).map(code => code.trim()).filter(code => code !== '');
    }
         
         else if (!Array.isArray(selected)) {
        selected = selected ? [selected] : [];
    }
         
        console.log('Converted to array:', selected);
        console.log('Final array to save:', selected);

        fetch('/includes/php/save_country_blocks.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocked: selected })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ Successful save! (' + data.count + ' country)');

                //window.showNotification('✅ Country blocks saved!', 'success');
            } else {
                
                alert('❌ Error: ' + (data.error || 'Unknown error'));

                //window.showNotification('❌ Save failed!', 'error');
            }
        });
        //.catch(err => console.error('Fetch hiba:', err));
    });
}

        
// A menü megnyitásakor inicializáljuk (pl. a gombra kattintva)
document.querySelector('#country-ip-blocking-menu .menu-main-btn').addEventListener('click', function() {
    // Ha még nincs inicializálva, indítsuk el
    if (!document.getElementById('country-dropdown').hasAttribute('data-initialized')) {
        initCountryDropdown();
        document.getElementById('country-dropdown').setAttribute('data-initialized', 'true');
    }
});

// 4 nappal ezelőtti munkánk, hozzáadtam
// Adatok szimulálása (Ide jön majd a fetch a PHP-tól)
let currentData = [
    { id: 1, poor: 10, middle: 20, rich: 50, max_cpu: 5 },
    { id: 2, poor: 15, middle: 30, rich: 70, max_cpu: 10 }
];

const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');

// 1. TÁBLÁZAT KIRAJZOLÁSA
function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="editable" data-field="poor">${item.poor}</td>
            <td class="editable" data-field="middle">${item.middle}</td>
            <td class="editable" data-field="rich">${item.rich}</td>
            <td class="editable" data-field="max_cpu">${item.max_cpu}</td>
            <td>
                <button class="btn-edit"><i class="fa fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteRow(${item.id})"><i class="fa fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 2. ÉLŐ KERESÉS (A 2. Codepen-ből)
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = currentData.filter(item => 
        Object.values(item).some(val => val.toString().toLowerCase().includes(term))
    );
    renderTable(filtered);
});

// 3. DUPLA KATTINTÁS SZERKESZTÉS (Az 1. Codepen logikája Vanilla-ban)
tableBody.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('editable')) {
        const cell = e.target;
        const originalValue = cell.innerText;
        const input = document.createElement('input');
        input.type = 'number';
        input.value = originalValue;
        
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();

        // Mentés Enter-re vagy fókusz elvesztésekor
        input.onblur = () => saveEdit(cell, input.value);
        input.onkeydown = (ev) => { if(ev.key === 'Enter') saveEdit(cell, input.value); };
    }
});

function saveEdit(cell, newValue) {
    cell.innerText = newValue;
    console.log("Azonnali mentés a PHP-nek: ", newValue);
    // Itt küldjük az AJAX/Fetch kérést a PHP-nak
}

// Kezdő betöltés
renderTable(currentData);


/* Fetch meghívás */
// Aktuálisan kiválasztott tábla neve
const planSelector = document.getElementById('planSelector');
let currentTableName = planSelector.value;

// TÁBLA VÁLTÁSA: Amikor a select-et átállítod
planSelector.addEventListener('change', (e) => {
    currentTableName = e.target.value;
    loadTableData(); // Új adatok betöltése az adatbázisból
});

// ADATOK BETÖLTÉSE (GET)
async function loadTableData() {
    try {
        const response = await fetch(`admin_api.php?table=${currentTableName}`);
        const data = await response.json();
        renderTable(data); // Kirajzolja a táblát az új adatokkal
    } catch (err) {
        console.error("Hiba a betöltéskor:", err);
    }
}

// ADAT MENTÉSE (UPDATE - Dupla kattintás után)
async function saveEdit(id, field, newValue) {
    const payload = {
        table: currentTableName,
        id: id,
        field: field,
        value: newValue
    };

    try {
        const response = await fetch('admin_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', ...payload })
        });
        const result = await response.json();
        if(result.success) console.log("Sikeres mentés!");
    } catch (err) {
        alert("Hiba a mentés során!");
    }
}

// ÚJ SOR HOZZÁADÁSA (INSERT - A Modal-ból)
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        table: currentTableName,
        poor: document.getElementById('poor_price').value,
        middle: document.getElementById('middle_price').value,
        rich: document.getElementById('rich_price').value,
        cpu: document.getElementById('max_cpu').value
    };

    try {
        await fetch('admin_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'insert', ...formData })
        });
        closeModalFunc(); // Bezárja a popupot
        loadTableData();  // Frissíti a listát
    } catch (err) {
        console.error("Hiba a hozzáadáskor");
    }
});
