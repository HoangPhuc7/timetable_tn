document.addEventListener('DOMContentLoaded', () => {
    // --- DỮ LIỆU ---
    const classes = ['Chọn', '10A1', '10A2', '10A3', '10A4', '10A5', '10A6', '10B1', '10B2', '10B3', '10B4', '11A1', '11A2', '11A3', '11A4', '11A5', '11B1', '11B2', '11B3', '12A1', '12A2', '12A3', '12A4', '12B1', '12B2', '12B3', '12B4', 'TN AV 1 (H.Thắm)', 'TN AV 2 (Cẩm)', 'TN AV 3 (P.Thắm)', 'TN HH 1 (B.Hạnh)', 'TN HH 2 (Thu H)', 'TN HH 3 (N.Hạnh)', 'TN HH 4 (Cúc H)', 'TN KTPL (Trong)', 'TN LS 1 (Hiểu)', 'TN LS 2 (Hoa)', 'TN LS 3 (Trang)', 'TN SH 1 (Anh)', 'TN SH 2 (Điền)', 'TN VL 1 (Hiếu)', 'TN VL 2 (Định)', 'TN VL 3 (Kha)', 'TN ĐL 1 (Định Đ)', 'TN ĐL 2 (Thu Đ)', 'TN ĐL 3 (Định Đ)', 'TN ĐL 4 (Thu Đ)', 'TN Toán 1 (Duyên)', 'TN Toán 2 (Trúc)', 'TN Toán 3 (Quang)', 'TN Toán 4 (Trầm)'];
    const TN = ['Chọn', 'TN AV 1 (H.Thắm)', 'TN AV 2 (Cẩm)', 'TN AV 3 (P.Thắm)', 'TN HH 1 (B.Hạnh)', 'TN HH 2 (Thu H)', 'TN HH 3 (N.Hạnh)', 'TN HH 4 (Cúc H)', 'TN KTPL (Trong)', 'TN LS 1 (Hiểu)', 'TN LS 2 (Hoa)', 'TN LS 3 (Trang)', 'TN SH 1 (Anh)', 'TN SH 2 (Điền)', 'TN VL 1 (Hiếu)', 'TN VL 2 (Định)', 'TN VL 3 (Kha)', 'TN ĐL 1 (Định Đ)', 'TN ĐL 2 (Thu Đ)', 'TN ĐL 3 (Định Đ)', 'TN ĐL 4 (Thu Đ)', 'TN Toán 1 (Duyên)', 'TN Toán 2 (Trúc)', 'TN Toán 3 (Quang)', 'TN Toán 4 (Trầm)'];
    const TN_extend = ['Chọn', 'TN Toán 1 (Duyên)', 'TN Toán 2 (Trúc)', 'TN Toán 3 (Quang)', 'TN Toán 4 (Trầm)'];
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const periods = ['S1', 'S2', 'S3', 'S4', 'S5', 'C1', 'C2', 'C3', 'C4', 'C5'];
    const rooms = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20", "P21", "P22", "P23", "P24", "PBM TO", "PTIN", "PĐHS"];

    // --- LẤY CÁC PHẦN TỬ DOM ---
    const classSelect = document.getElementById('class-select');
    const tnControls = document.getElementById('tn-controls');
    const tn1Select = document.getElementById('tn1-select');
    const tn2Select = document.getElementById('tn2-select');
    const tn3Select = document.getElementById('tn3-select');
    const submitButton = document.getElementById('submit-button');
    const messageArea = document.getElementById('message-area');
    const timetableContainer = document.getElementById('timetable-container');

    // --- CÁC HÀM TIỆN ÍCH ---

    // Hàm điền dữ liệu cho thẻ <select>
    const populateSelect = (selectElement, options) => {
        selectElement.innerHTML = '';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    };

    // Hàm lấy dữ liệu từ tệp .txt bằng fetch
    const getData = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Không tìm thấy tệp: ${filePath}`);
            }
            const text = await response.text();
            return text.split(/\r?\n/).map(line => line.trim());
        } catch (error) {
            console.error(error);
            showMessage(`Lỗi: ${error.message}`, 'warning');
            return null;
        }
    };
    
    // Hàm hiển thị thông báo
    const showMessage = (message, type = 'warning') => {
        messageArea.innerHTML = `<div class="${type}">${message}</div>`;
    };

    const clearMessageAndTable = () => {
        messageArea.innerHTML = '';
        timetableContainer.innerHTML = '';
    };

    // Hàm tái tạo logic `combine_files` của Python
    const combineFiles = (classLines, tn1Lines, tn2Lines, tnExtendLines) => {
        const padArray = (arr) => {
            while (arr.length < 60) arr.push("");
            return arr.slice(0, 60);
        };

        let combined = padArray([...classLines]);
        let tn1 = padArray([...tn1Lines]);
        let tn2 = padArray([...tn2Lines]);
        let tnExt = tnExtendLines ? padArray([...tnExtendLines]) : padArray([]);

        for (let i = 0; i < 60; i++) {
            // Xóa tên phòng học
            if (rooms.includes(combined[i])) combined[i] = "";
            if (rooms.includes(tn1[i])) tn1[i] = "";
            if (rooms.includes(tn2[i])) tn2[i] = "";
            if (rooms.includes(tnExt[i])) tnExt[i] = "";

            // Gộp môn TN1 và TN2 vào các ô trống
            if (combined[i] === "") {
                if (tn1[i] && !tn2[i]) {
                    combined[i] = tn1[i];
                } else if (!tn1[i] && tn2[i]) {
                    combined[i] = tn2[i];
                } else if (tn1[i] && tn2[i]) {
                    combined[i] = `${tn1[i]}  +  ${tn2[i]}`;
                }
            }
        }
        
        // Gộp môn TN mở rộng
        if(tnExtendLines) {
            for (let i = 0; i < 60; i++) {
                 if (combined[i] === "" && tnExt[i]) {
                     combined[i] = tnExt[i];
                 }
            }
        }

        return combined;
    };

    // Hàm chuyển mảng 60 dòng thành dữ liệu bảng 2D
    const readTimetable = (lines) => {
        if (lines.length > 60) {
            showMessage("Lỗi: Dữ liệu tệp không hợp lệ.");
            return null;
        }
        const paddedLines = [...lines];
        while (paddedLines.length < 60) paddedLines.push("");
        
        const timetable = [];
        for (let i = 0; i < 6; i++) {
            timetable.push(paddedLines.slice(i * 10, (i + 1) * 10));
        }
        return timetable;
    };

    // Hàm hiển thị TKB dưới dạng bảng HTML
    const displayTimetable = (title, timetable) => {
        timetableContainer.innerHTML = ''; // Xóa bảng cũ
        
        const subheader = document.createElement('h3');
        subheader.textContent = title;
        
        const table = document.createElement('table');
        const thead = table.createTHead();
        const tbody = table.createTBody();

        // Tạo hàng tiêu đề (Thứ)
        const headerRow = thead.insertRow();
        headerRow.insertCell().textContent = ""; // Ô trống
        days.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });

        // Tạo các hàng nội dung (Tiết)
        periods.forEach((period, periodIndex) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = period; // Cột đầu tiên là tên tiết
            days.forEach((day, dayIndex) => {
                row.insertCell().innerHTML = timetable[dayIndex][periodIndex] || '&nbsp;';
            });
        });
        
        timetableContainer.appendChild(subheader);
        timetableContainer.appendChild(table);
    };


    // --- KHỞI TẠO VÀ GÁN SỰ KIỆN ---

    // Điền dữ liệu cho các select box
    populateSelect(classSelect, classes);
    populateSelect(tn1Select, TN);
    populateSelect(tn2Select, TN);
    populateSelect(tn3Select, TN_extend);

    // Sự kiện khi thay đổi lớp
    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        clearMessageAndTable();
        
        if (selectedClass.startsWith('12')) {
            tnControls.classList.remove('hidden');
        } else {
            tnControls.classList.add('hidden');
        }
        // Reset nút button về trạng thái mặc định
        submitButton.textContent = "Lấy TKB";
    });

    // Sự kiện khi thay đổi môn TN để cập nhật tên nút
    const updateButtonText = () => {
         if(classSelect.value.startsWith('12') && tn1Select.value !== 'Chọn' && tn2Select.value !== 'Chọn') {
            submitButton.textContent = "Gộp TKB";
         } else {
            submitButton.textContent = "Lấy TKB";
         }
    };
    tn1Select.addEventListener('change', updateButtonText);
    tn2Select.addEventListener('change', updateButtonText);


    // Sự kiện khi click nút
    submitButton.addEventListener('click', async () => {
        clearMessageAndTable();

        const selectedClass = classSelect.value;
        const selectedTN1 = tn1Select.value;
        const selectedTN2 = tn2Select.value;
        const selectedTN3 = tn3Select.value;

        if (selectedClass === 'Chọn') {
            showMessage("Vui lòng chọn lớp.");
            return;
        }

        const isGrade12 = selectedClass.startsWith('12');
        const isTNSelected = selectedTN1 !== 'Chọn' || selectedTN2 !== 'Chọn';

        // Xử lý logic hiển thị TKB
        if (!isGrade12 || !isTNSelected) {
            // TKB thường
            const filePath = `file/K${selectedClass.substring(0,2)}/${selectedClass}.txt`;
            const lines = await getData(filePath);
            if(lines) {
                const timetable = readTimetable(lines);
                if (timetable) displayTimetable(selectedClass, timetable);
            }
        } else {
            // TKB lớp 12 có môn TN
            if ((selectedTN1 === 'Chọn' && selectedTN2 !== 'Chọn') || (selectedTN1 !== 'Chọn' && selectedTN2 === 'Chọn')) {
                 showMessage("Vui lòng chọn đầy đủ 2 môn ôn tốt nghiệp.");
                 return;
            }
            
            // Lấy dữ liệu từ các tệp
            const pathClass = `file/K${selectedClass.substring(0,2)}/${selectedClass}.txt`;
            const pathTN1 = `file/KTN/${selectedTN1}.txt`; // Giả định thư mục KTN
            const pathTN2 = `file/KTN/${selectedTN2}.txt`; // Giả định thư mục KTN
            
            const [classLines, tn1Lines, tn2Lines] = await Promise.all([
                getData(pathClass),
                getData(pathTN1),
                getData(pathTN2)
            ]);
            
            let tn3Lines = null;
            if (selectedTN3 !== 'Chọn') {
                const pathTN3 = `file/KTN/${selectedTN3}.txt`; // Giả định thư mục KTN
                tn3Lines = await getData(pathTN3);
            }

            // Kiểm tra nếu có lỗi fetch
            if (!classLines || !tn1Lines || !tn2Lines || (selectedTN3 !== 'Chọn' && !tn3Lines)) {
                showMessage("Không thể tải một hoặc nhiều tệp TKB. Vui lòng kiểm tra lại đường dẫn.", "warning");
                return;
            }

            const combinedLines = combineFiles(classLines, tn1Lines, tn2Lines, tn3Lines);
            const timetable = readTimetable(combinedLines);

            if (timetable) {
                let title = `${selectedClass} - ${selectedTN1} - ${selectedTN2}`;
                if (selectedTN3 !== 'Chọn') {
                    title += ` - ${selectedTN3}`;
                }
                displayTimetable(title, timetable);
            }
        }
    });
});