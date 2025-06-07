import requests
import json
import os
from datetime import datetime

DATA_PATH = "data/lotto_data.json"

def get_lotto_result(round_num):
    url = f"https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={round_num}"
    try:
        res = requests.get(url, timeout=5)
        res.raise_for_status()
        data = res.json()

        if data.get('returnValue') != 'success':
            return None

        return {
            "회차": data['drwNo'],
            "추첨일": data['drwNoDate'],
            "번호": [data[f'drwtNo{i}'] for i in range(1, 7)],
            "보너스": data['bnusNo']
        }
    except Exception as e:
        print(f"[{round_num}회] 요청 실패: {e}")
        return None

def load_existing_data():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_data(data):
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_lotto_data():
    existing_data = load_existing_data()
    existing_rounds = {item["회차"] for item in existing_data}
    max_existing_round = max(existing_rounds) if existing_rounds else 0

    new_data = []
    for r in range(max_existing_round + 1, max_existing_round + 20):  # 여유 있게 20회 시도
        result = get_lotto_result(r)
        if result:
            print(f"✅ {r}회차 업데이트됨")
            new_data.append(result)
        else:
            print(f"🛑 {r}회차 없음 (중단)")
            break

    all_data = existing_data + new_data
    save_data(all_data)
    print(f"\n📁 총 {len(all_data)}회차 저장 완료 (최신: {all_data[-1]['회차']}회)")

if __name__ == "__main__":
    print(f"[{datetime.now()}] 로또 데이터 자동 업데이트 시작")
    update_lotto_data()
