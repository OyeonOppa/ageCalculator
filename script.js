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
    const today = new Date();
    
    // คำนวณอายุแบบแม่นยำ
    let years = today.getFullYear() - birthdate.getFullYear();
    let months = today.getMonth() - birthdate.getMonth();
    let days = today.getDate() - birthdate.getDate();

    // ปรับค่าถ้าเดือนหรือวันยังไม่ถึง
    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // ตรวจสอบเงื่อนไข 48 ปี
    let isEligible = false;
    let statusText = '';
    let statusIcon = '';
    
    if (years > 48) {
        // เกิน 48 ปี
        isEligible = false;
        statusText = 'ไม่ผ่านเกณฑ์';
        statusIcon = 'error';
    } else if (years === 48 && (months > 0 || days > 0)) {
        // 48 ปี แต่มีเดือนหรือวันเกิน
        isEligible = false;
        statusText = 'ไม่ผ่านเกณฑ์';
        statusIcon = 'error';
    } else if (years === 48 && months === 0 && days === 0) {
        // 48 ปีพอดี
        isEligible = true;
        statusText = 'ผ่านเกณฑ์';
        statusIcon = 'success';
    } else {
        // น้อยกว่า 48 ปี
        isEligible = true;
        statusText = 'ผ่านเกณฑ์';
        statusIcon = 'success';
    }

    // แสดงผลด้วย SweetAlert2
    Swal.fire({
        icon: statusIcon,
        title: statusText,
        html: `
            <div style="text-align: left; padding: 20px;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                    <strong>📅 อายุของท่าน:</strong> ${years} ปี ${months} เดือน ${days} วัน
                </p>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 16px; color: ${isEligible ? '#38a169' : '#e53e3e'};">
                    <strong>🔍 ผลการตรวจสอบ:</strong> ${isEligible ? 'อายุไม่เกิน 48 ปี (ผ่าน ✅)' : 'อายุเกิน 48 ปี (ไม่ผ่าน ❌)'}
                </p>
            </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: isEligible ? '#38a169' : '#e53e3e',
        width: '500px'
    });
});
