import json
import random
from calendar import month_name
import secrets

month_names = list(month_name)


def generate_dummy_data(year):
    data = {
        "_id": secrets.token_hex(12),
        "year": year,
        "totalProfit": f"${random.uniform(100000, 200000):.2f}",
        "totalRevenue": f"${random.uniform(250000, 350000):.2f}",
        "totalExpenses": f"${random.uniform(50000, 80000):.2f}",
        "monthlyData": [],
        "dailyData": [],
        "expensesByCategory": {
            "salaries": f"${random.uniform(30000, 40000):.2f}",
            "supplies": f"${random.uniform(10000, 15000):.2f}",
            "services": f"${random.uniform(9000, 11000):.2f}",
        }
    }

    for month_num, month_name in enumerate(month_names[1:], start=1):
        monthly_entry = {
            "month": month_name,
            "revenue": f"${random.uniform(10000, 20000):.2f}",
            "expenses": f"${random.uniform(10000, 20000):.2f}",
            "operationalExpenses": f"${random.uniform(8000, 15000):.2f}",
            "nonOperationalExpenses": f"${random.uniform(2000, 5000):.2f}"
        }
        data["monthlyData"].append(monthly_entry)

    for month_num in range(1, 13):
        for day in range(1, 32):
            date = f"{year}-{month_num:02d}-{day:02d}"
            daily_entry = {
                "date": date,
                "revenue": f"${random.uniform(1000, 1500):.2f}",
                "expenses": f"${random.uniform(300, 500):.2f}"
            }
            data["dailyData"].append(daily_entry)

    return data


def save_to_json(data, filename):
    with open(filename, "w") as json_file:
        json.dump(data, json_file, indent=4)


if __name__ == "__main__":
    year = int(input("Enter the year: "))
    dummy_data = generate_dummy_data(year)
    save_to_json(dummy_data, f"revenue_data_{year}.json")
    print(f"revenue_data for {year} saved to revenue_data_{year}.json")
