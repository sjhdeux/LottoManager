import json
from collections import Counter
import os
import random

DATA_FILE = "data/lotto_data.json"
PREDICTED_FILE = "data/predicted.json"

def generate_prediction():
    if not os.path.exists(DATA_FILE):
        print("❌ lotto_data.json 파일이 존재하지 않습니다.")
        return

    with open(DATA_FILE, encoding='utf-8') as f:
        data = json.load(f)

    # 전체 번호 출현 빈도 계산
    all_numbers = []
    for draw in data:
        all_numbers.extend(draw['번호'])
    counter = Counter(all_numbers)

    # 출현 빈도 순 정렬
    most_common_all = [num for num, _ in counter.most_common()]
    
    # 가장 많이 나온 번호 중 랜덤하게 3개
    top_pool = most_common_all[:15]   # 상위 15개 중에서
    most_common = random.sample(top_pool, 3)

    # 가장 적게 나온 번호 중 랜덤하게 3개
    bottom_pool = most_common_all[-15:]  # 하위 15개 중에서
    least_common = random.sample(bottom_pool, 3)

    # 추천 번호 = 상위 3개 + 하위 3개 (중복 제거, 6개가 안 되면 채우기)
    recommended = list(set(most_common + least_common))

    # 부족하면 무작위 번호 추가
    while len(recommended) < 6:
        n = random.randint(1, 45)
        if n not in recommended:
            recommended.append(n)

    prediction = {
        "추천번호": sorted(recommended)
    }

    os.makedirs(os.path.dirname(PREDICTED_FILE), exist_ok=True)
    with open(PREDICTED_FILE, 'w', encoding='utf-8') as f:
        json.dump(prediction, f, ensure_ascii=False, indent=2)

    print(f"✅ 추천 번호 생성 완료: {prediction['추천번호']}")

if __name__ == "__main__":
    generate_prediction()
