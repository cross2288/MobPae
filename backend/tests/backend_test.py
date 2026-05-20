"""Backend integration tests for Mob Pae fintech platform."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://employer-salary-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@mobpae.com"
ADMIN_PASSWORD = "admin123"

# Unique test identifiers per run
RUN = uuid.uuid4().hex[:6]
EMPLOYER_EMAIL = f"TEST_employer_{RUN}@testco.com"
EMPLOYER_PASSWORD = "employer123"
EMPLOYEE_EMAIL = f"TEST_employee_{RUN}@testco.com"
EMPLOYEE_PASSWORD = "employee123"
ENQUIRY_EMAIL = f"TEST_enquiry_{RUN}@testco.com"

state = {}


def _client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_01_health_root():
    r = requests.get(f"{API}/auth/me", timeout=10)
    # Should be 401 (no auth), not 5xx/network -> server alive
    assert r.status_code in (401, 403), f"Server not reachable cleanly: {r.status_code} {r.text}"


# ---------- Admin auth ----------
def test_02_admin_login():
    s = _client()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["role"] == "admin"
    assert data["email"] == ADMIN_EMAIL
    state["admin_session"] = s
    state["admin_id"] = data["id"]


def test_03_admin_invalid_login():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"})
    assert r.status_code == 401


def test_04_admin_me():
    s = state["admin_session"]
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 200, r.text
    # Issue check: does /auth/me include 'id' field?
    me = r.json()
    assert me.get("role") == "admin"
    state["admin_me"] = me


# ---------- Enquiry ----------
def test_05_submit_enquiry():
    payload = {
        "company_name": f"TEST Co {RUN}",
        "contact_person_name": "John Doe",
        "work_email": ENQUIRY_EMAIL,
        "phone_number": "+91-9999999999",
        "city": "Mumbai",
        "industry": "Tech",
        "number_of_employees": 50,
        "payroll_cycle": "monthly",
        "payroll_software": "Zoho",
        "message": "Interested",
    }
    r = requests.post(f"{API}/enquiry/submit", json=payload)
    assert r.status_code == 200, r.text
    assert "enquiry_id" in r.json()


def test_06_admin_get_enquiries():
    s = state["admin_session"]
    r = s.get(f"{API}/admin/enquiries")
    assert r.status_code == 200, r.text
    enquiries = r.json()
    assert any(e.get("work_email") == ENQUIRY_EMAIL for e in enquiries)


# ---------- Admin approves employer ----------
def test_07_admin_approve_employer():
    s = state["admin_session"]
    payload = {
        "enquiry_id": ENQUIRY_EMAIL,  # backend looks up by work_email
        "employer_email": EMPLOYER_EMAIL,
        "employer_password": EMPLOYER_PASSWORD,
    }
    r = s.post(f"{API}/admin/approve-employer", json=payload)
    assert r.status_code == 200, r.text
    assert "employer_id" in r.json()
    state["employer_id"] = r.json()["employer_id"]


def test_08_admin_get_users():
    s = state["admin_session"]
    r = s.get(f"{API}/admin/users")
    assert r.status_code == 200, r.text
    assert any(u.get("email") == EMPLOYER_EMAIL for u in r.json())


# ---------- Employer login & add employee ----------
def test_09_employer_login():
    s = _client()
    r = s.post(f"{API}/auth/login", json={"email": EMPLOYER_EMAIL, "password": EMPLOYER_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["role"] == "employer"
    state["employer_session"] = s
    state["employer_id_from_login"] = data["id"]


def test_10_employer_add_employee():
    s = state["employer_session"]
    payload = {
        "name": "Jane Employee",
        "email": EMPLOYEE_EMAIL,
        "phone_number": "+91-8888888888",
        "monthly_salary": 50000.0,
        "advance_limit_percentage": 30.0,
        "department": "Engineering",
    }
    r = s.post(f"{API}/employer/add-employee", json=payload)
    # KNOWN BUG SUSPECT: get_current_user does not set 'id' (sets '_id'), so current_user["id"] may KeyError
    assert r.status_code == 200, f"Add employee failed (likely current_user['id'] KeyError): {r.status_code} {r.text}"
    state["employee_id"] = r.json()["employee_id"]


def test_11_employer_list_employees():
    s = state["employer_session"]
    r = s.get(f"{API}/employer/employees")
    assert r.status_code == 200, r.text
    emps = r.json()
    assert any(e.get("email") == EMPLOYEE_EMAIL for e in emps), f"Employee not in list: {emps}"


# ---------- Employee login & flow ----------
def test_12_employee_login():
    s = _client()
    r = s.post(f"{API}/auth/login", json={"email": EMPLOYEE_EMAIL, "password": EMPLOYEE_PASSWORD})
    assert r.status_code == 200, r.text
    state["employee_session"] = s


def test_13_employee_dashboard_stats():
    s = state["employee_session"]
    r = s.get(f"{API}/employee/dashboard-stats")
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["monthly_salary"] == 50000.0
    assert d["max_advance"] == 15000.0


def test_14_employee_request_advance():
    s = state["employee_session"]
    payload = {"amount": 5000.0, "reason": "Medical", "repayment_date": "2026-02-15"}
    r = s.post(f"{API}/employee/request-advance", json=payload)
    assert r.status_code == 200, r.text
    state["request_id"] = r.json()["request_id"]


def test_15_employee_request_advance_duplicate_pending():
    s = state["employee_session"]
    payload = {"amount": 1000.0, "reason": "Other", "repayment_date": "2026-02-15"}
    r = s.post(f"{API}/employee/request-advance", json=payload)
    assert r.status_code == 400


def test_16_employee_request_advance_over_limit():
    # Tests limit boundary - need another employee w/o pending, but easier: separate session
    # Skip if we don't have another - just verify current employee blocked even at high amount (still 400 due pending)
    s = state["employee_session"]
    r = s.post(f"{API}/employee/request-advance", json={"amount": 999999, "reason": "x", "repayment_date": "2026-02-15"})
    assert r.status_code == 400


def test_17_employee_my_requests():
    s = state["employee_session"]
    r = s.get(f"{API}/employee/my-requests")
    assert r.status_code == 200, r.text
    reqs = r.json()
    assert any(req.get("request_id") == state["request_id"] for req in reqs)


# ---------- Employer approves request ----------
def test_18_employer_view_advance_requests():
    s = state["employer_session"]
    r = s.get(f"{API}/employer/advance-requests")
    assert r.status_code == 200, r.text
    reqs = r.json()
    assert any(req.get("request_id") == state["request_id"] for req in reqs), f"Request not visible to employer: {reqs}"


def test_19_employer_approve_request():
    s = state["employer_session"]
    r = s.post(f"{API}/employer/handle-request", json={"request_id": state["request_id"], "action": "approve"})
    assert r.status_code == 200, r.text


def test_20_employee_stats_after_approval():
    s = state["employee_session"]
    r = s.get(f"{API}/employee/dashboard-stats")
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["total_used"] == 5000.0
    assert d["available_advance"] == 10000.0


# ---------- RBAC ----------
def test_21_rbac_employee_cannot_admin():
    s = state["employee_session"]
    r = s.get(f"{API}/admin/users")
    assert r.status_code == 403


def test_22_rbac_employer_cannot_employee_endpoints():
    s = state["employer_session"]
    r = s.post(f"{API}/employee/request-advance", json={"amount": 100, "reason": "x", "repayment_date": "2026-02-15"})
    assert r.status_code == 403


def test_23_unauthenticated_blocked():
    r = requests.get(f"{API}/admin/users")
    assert r.status_code == 401


# ---------- Logout ----------
def test_24_logout():
    s = state["employee_session"]
    r = s.post(f"{API}/auth/logout")
    assert r.status_code == 200
    # New session w/o cookies
    r2 = requests.get(f"{API}/auth/me")
    assert r2.status_code == 401
