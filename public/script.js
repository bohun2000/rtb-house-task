function handleScroll() {
    const img = document.getElementById('userAvatar');
    const rect = img.getBoundingClientRect();
    
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            fetch('/api/scroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: storedUserId })
            }).then(() => {
                window.removeEventListener('scroll', handleScroll);
            }).catch(error => {
                console.error('Error updating scroll status:', error);
            });
        }
    }
}

document.getElementById('reportBtn').addEventListener('click', () => {
    window.location.href = '/report';
});

window.addEventListener('load', () => {
    window.addEventListener('scroll', handleScroll);
});