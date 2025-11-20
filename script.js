// ตั้งค่า max date เป็นวันนี้
document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];

document.getElementById('ageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const birthdateInput = document.getElementById('birthdate').value;
    
    if (!birthdateInput) {
        Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูล',
            text: 'กรุณาเลือกวันเดือนปีเกิดของท่าน',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    const birthdate = new Date(birthdateInput);
    // กำหนดวันที่ตรวจสอบเป็น 17 พฤศจิกายน 2568
    const checkDate = new Date(2025, 10, 17); // เดือน 10 = พฤศจิกายน (0-indexed)
    
    // คำนวณอายุแบบแม่นยำ
    let years = checkDate.getFullYear() - birthdate.getFullYear();
    let months = checkDate.getMonth() - birthdate.getMonth();
    let days = checkDate.getDate() - birthdate.getDate();

    // ปรับค่าถ้าเดือนหรือวันยังไม่ถึง
    if (days < 0) {
        months--;
        const prevMonth = new Date(checkDate.getFullYear(), checkDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // ตรวจสอบเงื่อนไข 35-48 ปี
    let isEligible = false;
    let statusText = '';
    let statusIcon = '';
    let reasonText = '';
    
    if (years < 35) {
        // อายุต่ำกว่า 35 ปี
        isEligible = false;
        statusText = 'ไม่ผ่านเกณฑ์';
        statusIcon = 'error';
        reasonText = 'อายุต่ำกว่า 35 ปี';
    } else if (years > 48) {
        // เกิน 48 ปี
        isEligible = false;
        statusText = 'ไม่ผ่านเกณฑ์';
        statusIcon = 'error';
        reasonText = 'อายุเกิน 48 ปี';
    } else if (years === 48 && (months > 0 || days > 0)) {
        // 48 ปี แต่มีเดือนหรือวันเกิน
        isEligible = false;
        statusText = 'ไม่ผ่านเกณฑ์';
        statusIcon = 'error';
        reasonText = 'อายุเกิน 48 ปี';
    } else {
        // ระหว่าง 35-48 ปี (รวม 35 ปีพอดี และ 48 ปีพอดี)
        isEligible = true;
        statusText = 'ผ่านเกณฑ์';
        statusIcon = 'success';
        reasonText = 'อายุอยู่ระหว่าง 35-48 ปี';
    }

    // แสดงผลด้วย SweetAlert2
    Swal.fire({
        icon: statusIcon,
        title: statusText,
        html: `
            <div style="text-align: left; padding: 20px;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                    <strong>📅 อายุของท่าน ณ วันที่ 17 พ.ย. 2568:</strong><br>
                    ${years} ปี ${months} เดือน ${days} วัน
                </p>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 16px; color: ${isEligible ? '#38a169' : '#e53e3e'}; margin-bottom: 10px;">
                    <strong>🔍 ผลการตรวจสอบ:</strong> ${reasonText}
                </p>
                <p style="font-size: 16px; font-weight: 600; color: ${isEligible ? '#38a169' : '#e53e3e'};">
                    ${isEligible ? '✅ ผ่านเกณฑ์' : '❌ ไม่ผ่านเกณฑ์'}
                </p>
            </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: isEligible ? '#38a169' : '#e53e3e',
        width: '500px'
    });
});
