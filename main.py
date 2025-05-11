import streamlit as st
import pandas as pd
import os


classes = ["Chọn lớp"]
for _, _, files in os.walk("./file"):
    for file in files:
        if file.endswith(".txt"):
            file_name = file.replace(".txt", "")
            classes.append(file_name)


days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7']
periods = ['S1', 'S2', 'S3', 'S4', 'S5',
           'C1', 'C2', 'C3', 'C4', 'C5']

def read_timetable(filename):
    if not os.path.exists(filename):
        st.error("Không có kết quả")
        return None

    with open(filename, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines()]

    
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
        'Tiết': periods
    }

    for i, day in enumerate(days):
        table_data[day] = timetable[i]

    df = pd.DataFrame(table_data)
    st.table(df)


selected_class = st.selectbox("Chọn lớp / Môn ôn TN:", classes)

if selected_class != "Chọn lớp":
    filename = f"{selected_class}.txt"
    file_path = f"./file/K{selected_class[:2]}/{selected_class}.txt"
    timetable = read_timetable(file_path)

    if timetable:
        st.subheader(f"{selected_class}")
        display_timetable(timetable)

