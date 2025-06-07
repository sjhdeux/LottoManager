import json
from collections import Counter
import os

DATA_FILE = "data/lotto_data.json"
PREDICTED_FILE = "data/predicted.json"

def generate_prediction():
    if not os.path.exists(DATA_FILE):
        print("❌ lotto_data.json 파일이 존재하지 않습니다.")
        return

    with open(DATA_FILE, encoding='utf-8') as f:
        data = json.load(f)

    # 전체 번호 출현 횟수 계산
    all_numbers = []
    for draw in data:
        all_numbers.extend(draw['번호'])

    counter = Counter(all_numbers)
    most_common = [num for num, _ in counter.most_common(6)]

    prediction = {
        "추천번호": sorted(most_common)
    }

    with open(PREDICTED_FILE, 'w', encoding='utf-8') as f:
        json.dump(prediction, f, ensure_ascii=False, indent=2)

    print(f"✅ 추천 번호 생성 완료: {prediction['추천번호']}")

if __name__ == "__main__":
    generate_prediction()
