# start both the frontend and backend in parallel
start:
	(cd frontend && make start) & (cd backend && make start)