"""Generate the fictional practice datasets for the AI-Assisted MEAL Data Analyst pathway.

Every person in these files is invented. The files deliberately contain data quality
problems (test rows, duplicates, inconsistent categories, impossible values, an outlier,
missing follow-ups) for learners to find and log.

Usage: python3 scripts/generate-meal-practice-data.py
Writes to public/pathways/ai-meal-data-analysis/.
"""
import csv
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "pathways" / "ai-meal-data-analysis"
STATES = ["FCT", "Nasarawa"]
TRADES = {"tailoring": ["tailoring", "Tailoring", "tailoring "], "phone_repair": ["phone_repair", "Phone Repair", "phone repairs"], "catering": ["catering", "Catering"]}
SEX = {"female": ["female", "Female", "F"], "male": ["male", "Male", "M"]}
FEEDBACK = [
    "My starter kit came two months after training ended",
    "Twelve weeks is not enough to learn tailoring well",
    "Our instructor was patient and explained well",
    "No shop or space to work from after training",
    "I need help finding customers",
    "The machine in my kit was missing parts",
    "Training was good, transport money was too small",
    "I would like advanced classes",
    "Customers in my area cannot pay much",
    "The business skills sessions helped me keep records",
    "",
]


def pick_variant(rng, options, messy):
    return rng.choice(options) if messy else options[0]


def person(rng, pid):
    sex = rng.choices(["female", "male"], [0.52, 0.48])[0]
    trade = rng.choice(list(TRADES))
    income_before = rng.choice([0, 0, 0, 5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000])
    working = rng.random() < (0.55 if sex == "female" else 0.63) + (0.07 if trade != "tailoring" else 0)
    income_after = round(rng.lognormvariate(10.6, 0.5), -3) if working else 0
    return {"participant_id": pid, "state": rng.choice(STATES), "sex": sex, "age": rng.randint(18, 35), "trade": trade,
            "income_before_ngn": income_before, "working_6m": "yes" if working else "no", "income_6m_ngn": int(income_after)}


def baseline_sample(rng):
    rows = []
    for i in range(1, 59):
        p = person(rng, f"R-{i:04d}")
        p["completed_training"] = "yes" if rng.random() < 0.9 else "no"
        p["sex"] = pick_variant(rng, SEX[p["sex"]], rng.random() < 0.2)
        p["trade"] = pick_variant(rng, TRADES[p["trade"]], rng.random() < 0.2)
        if p["completed_training"] == "no":
            p["working_6m"], p["income_6m_ngn"] = "", ""
        rows.append(p)
    rows[11]["age"] = 41                 # outside the 18-35 eligibility range
    rows[23]["income_6m_ngn"] = 4500000  # likely typing error
    rows[30]["income_before_ngn"] = ""   # missing
    rows[37]["working_6m"] = ""          # missing
    rows.append(dict(rows[5]))           # exact duplicate
    rows.append(dict(rows[17]))          # exact duplicate
    rng.shuffle(rows)
    return rows


def followup_raw(rng):
    rows = []
    for i in range(1, 601):
        p = person(rng, f"R-{i:04d}")
        responded = rng.random() < 0.92
        row = {"submission_id": f"S{i:05d}", "participant_id": p["participant_id"], "submitted": f"2026-{rng.choice(['09', '10'])}-{rng.randint(1, 28):02d}",
               "state": p["state"], "sex": pick_variant(rng, SEX[p["sex"]], rng.random() < 0.08), "age": p["age"],
               "trade": pick_variant(rng, TRADES[p["trade"]], rng.random() < 0.06), "consent": "yes" if responded else "",
               "working": p["working_6m"] if responded else "", "income_30d_ngn": p["income_6m_ngn"] if responded and p["working_6m"] == "yes" else "",
               "feedback": rng.choice(FEEDBACK) if responded else ""}
        rows.append(row)
    for j in (40, 211, 388, 455):
        rows[j]["age"] = rng.choice([15, 17, 39, 52])
    rows[302]["income_30d_ngn"] = 9500000
    for j in (60, 144, 270, 333, 501):
        rows[j]["working"], rows[j]["income_30d_ngn"], rows[j]["consent"] = "no", 30000, "yes"
    extra = []
    for n, j in enumerate((7, 99, 150, 222, 310, 401, 470, 512, 590), 1):
        dup = dict(rows[j]); dup["submission_id"] = f"S9{n:04d}"; extra.append(dup)
    for n, j in enumerate((88, 260, 444), 1):
        conflict = dict(rows[j]); conflict["submission_id"] = f"S8{n:04d}"
        conflict["working"] = "no" if conflict["working"] == "yes" else "yes"
        conflict["income_30d_ngn"] = "" if conflict["working"] == "no" else 40000
        conflict["consent"] = "yes"; extra.append(conflict)
    for n in range(1, 7):
        extra.append({"submission_id": f"T{n:04d}", "participant_id": f"TEST-{n}", "submitted": "2026-09-01", "state": "FCT", "sex": "female", "age": 25,
                      "trade": "catering", "consent": "yes", "working": "yes", "income_30d_ngn": 1, "feedback": "test"})
    rows += extra
    rng.shuffle(rows)
    return rows


def write(name, rows):
    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / name, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"wrote {name}: {len(rows)} rows")


if __name__ == "__main__":
    write("rise_baseline_sample.csv", baseline_sample(random.Random(2026)))
    write("rise_followup_raw.csv", followup_raw(random.Random(42)))
