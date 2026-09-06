FROM python:3.12-slim

WORKDIR /app

# Asennetaan riippuvuudet erillisenä kerroksena välimuistin hyödyntämiseksi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopioidaan sovelluskoodi
COPY app/ ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
