
import streamlit as st
import pandas as pd

classes = ['Chọn', '10A1', '10A2', '10A3', '10A4', '10A5', '10A6', '10B1', '10B2', '10B3', '10B4', '11A1', '11A2', '11A3', '11A4', '11A5', '11B1', '11B2', '11B3', '12A1', '12A2', '12A3', '12A4', '12B1', '12B2', '12B3', '12B4', 'TN AV 1 (H.Thắm)', 'TN AV 2 (Cẩm)', 'TN AV 3 (P.Thắm)', 'TN HH 1 (B.Hạnh)', 'TN HH 2 (Thu H)', 'TN HH 3 (N.Hạnh)', 'TN HH 4 (Cúc H)', 'TN KTPL (Trong)', 'TN LS 1 (Hiểu)', 'TN LS 2 (Hoa)', 'TN LS 3 (Trang)', 'TN SH 1 (Anh)', 'TN SH 2 (Điền)', 'TN VL 1 (Hiếu)', 'TN VL 2 (Định)', 'TN VL 3 (Kha)', 'TN ĐL 1 (Định Đ)', 'TN ĐL 2 (Thu Đ)', 'TN ĐL 3 (Định Đ)', 'TN ĐL 4 (Thu Đ)', 'TN Toán 1 (Duyên)', 'TN Toán 2 (Trúc)', 'TN Toán 3 (Quang)', 'TN Toán 4 (Trầm)']
TN = ['Chọn', 'TN AV 1 (H.Thắm)', 'TN AV 2 (Cẩm)', 'TN AV 3 (P.Thắm)', 'TN HH 1 (B.Hạnh)', 'TN HH 2 (Thu H)', 'TN HH 3 (N.Hạnh)', 'TN HH 4 (Cúc H)', 'TN KTPL (Trong)', 'TN LS 1 (Hiểu)', 'TN LS 2 (Hoa)', 'TN LS 3 (Trang)', 'TN SH 1 (Anh)', 'TN SH 2 (Điền)', 'TN VL 1 (Hiếu)', 'TN VL 2 (Định)', 'TN VL 3 (Kha)', 'TN ĐL 1 (Định Đ)', 'TN ĐL 2 (Thu Đ)', 'TN ĐL 3 (Định Đ)', 'TN ĐL 4 (Thu Đ)', 'TN Toán 1 (Duyên)', 'TN Toán 2 (Trúc)', 'TN Toán 3 (Quang)', 'TN Toán 4 (Trầm)']
TN_extend = ['Chọn', 'TN Toán 1 (Duyên)', 'TN Toán 2 (Trúc)', 'TN Toán 3 (Quang)', 'TN Toán 4 (Trầm)']

days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7']
periods = ['S1', 'S2', 'S3', 'S4', 'S5',
		   'C1', 'C2', 'C3', 'C4', 'C5']


def get_data(file_name):
	with open(file_name, 'r', encoding='utf-8') as f:
		lines = [line.strip() for line in f.readlines()]
	return lines



def combine_files(class_file, TN_1, TN_2, TN_extend):
	with open(class_file, 'r', encoding='utf-8') as f:
		class_lines = [line.strip() for line in f.readlines()]
	
	with open(TN_1, 'r', encoding='utf-8') as f:
		TN_1_lines = [line.strip() for line in f.readlines()]
	
	with open(TN_2, 'r', encoding='utf-8') as f:
		TN_2_lines = [line.strip() for line in f.readlines()]
	
	while len(class_lines) < 60:
		class_lines.append("")
	
	while len(TN_1_lines) < 60:
		TN_1_lines.append("")
	
	while len(TN_2_lines) < 60:
		TN_2_lines.append("")
	
	rooms = ["P1", "P2", "P3", "P4", "P5", "P6",
		     "P7", "P8", "P9", "P10", "P11", "P12",
			 "P13", "P14", "P15", "P16", "P17", "P18",
			 "P19", "P20", "P21", "P22", "P23", "P24",
			 "PBM TO", "PTIN", "PĐHS"]

	for i in range(60):
		if class_lines[i] in rooms:
			class_lines[i] = ""
		if TN_1_lines[i] in rooms:
			TN_1_lines[i] = ""
		if TN_2_lines[i] in rooms:
			TN_2_lines[i] = ""
		
		if class_lines[i] == "":
			if TN_1_lines[i] != "" and TN_2_lines[i] == "":
				class_lines[i] = TN_1_lines[i]
			elif TN_1_lines[i] == "" and TN_2_lines[i] != "":
				class_lines[i] = TN_2_lines[i]
			elif TN_1_lines[i] == "" and TN_2_lines[i] == "":
				class_lines[i] = ""
			else:
				class_lines[i] = TN_1_lines[i] + "  +  " + TN_2_lines[i]
	
	if TN_extend != "":
		with open(TN_extend, 'r', encoding='utf-8') as f:
			TN_extend_lines = [line.strip() for line in f.readlines()]
		
		while len(TN_extend_lines) < 60:
			TN_extend_lines.append("")
		
		for i in range(60):
			if class_lines[i] == "":
				if TN_extend_lines[i] != "":
					class_lines[i] = TN_extend_lines[i]
	
	return class_lines



def read_timetable(lines):
	if len(lines) > 60:
		st.error("Lỗi dòng")
		return None

	while len(lines) < 60:
		lines.append("")

	timetable = []
	for i in range(6):
		day_schedule = lines[i*10:(i+1)*10]
		timetable.append(day_schedule)

	return timetable



def display_timetable(timetable):
	table_data = {
		"": periods
	}

	for i, day in enumerate(days):
		table_data[day] = timetable[i]

	df = pd.DataFrame(table_data)
	st.table(df)



def TKB_Normal(file_path_class_basic):
	lines_timetable = get_data(file_path_class_basic)
	timetable = read_timetable(lines_timetable)
	if timetable:
		st.subheader(f"{selected_class_basic}")
		display_timetable(timetable)


st.title("Ngày áp dụng: 09/06/2025")
selected_class_basic = st.selectbox("Chọn lớp", classes, key="basic_class")
text_final = "Lấy TKB"
if selected_class_basic.startswith("12"):
	selected_class_TN_1 = st.selectbox("Chọn môn TN 1", TN, key="tn1")
	selected_class_TN_2 = st.selectbox("Chọn môn TN 2", TN, key="tn2")
	selected_class_TN_3 = st.selectbox("Chọn môn TN mở rộng (Nếu có)", TN_extend, key="tn3")
	if selected_class_TN_1 != "Chọn" and selected_class_TN_2 != "Chọn":
		text_final = "Gộp TKB"
 
file_path_class_basic = f"./file/K{selected_class_basic[:2]}/{selected_class_basic}.txt"

if st.button(text_final, key="final_tkb"):
	if selected_class_basic != "Chọn":
		if selected_class_basic[:2] != "12":
			TKB_Normal(file_path_class_basic)
		else:
			if selected_class_TN_1 == "Chọn" and selected_class_TN_2 == "Chọn":
				TKB_Normal(file_path_class_basic)
			else:
				if (selected_class_TN_1 == "Chọn" and selected_class_TN_2 != "Chọn") or (selected_class_TN_1 != "Chọn" and selected_class_TN_2 == "Chọn"):
					st.warning("Vui lòng chọn đầy đủ 2 môn ôn tốt nghiệp.")
				else:
					file_path_class_TN_1 = f"./file/K{selected_class_TN_2[:2]}/{selected_class_TN_1}.txt"
					file_path_class_TN_2 = f"./file/K{selected_class_TN_2[:2]}/{selected_class_TN_2}.txt"
					file_path_class_TN_3 = f"./file/K{selected_class_TN_2[:2]}/{selected_class_TN_3}.txt"
					if selected_class_TN_3 == "Chọn":
						file_path_class_TN_3 = ""
					lines_timetable = combine_files(file_path_class_basic, file_path_class_TN_1, file_path_class_TN_2, file_path_class_TN_3)
					timetable = read_timetable(lines_timetable)
					if timetable:
						if selected_class_TN_3 != "Chọn":
							selected_class_TN_3 = " - " + selected_class_TN_3
						st.subheader(f"{selected_class_basic} - {selected_class_TN_1} - {selected_class_TN_2}{selected_class_TN_3}")
						display_timetable(timetable)
	else:
		st.warning("Vui lòng chọn lớp.")