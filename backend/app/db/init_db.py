from app.db.session import SessionLocal
from app.services.seed import seed_catalog

def main():
    db = SessionLocal()
    try:
        seed_catalog(db)
        print("Siemennys suoritettu onnistuneesti.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
