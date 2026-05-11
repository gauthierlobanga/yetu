export default function getToastStyle(type: 'success' | 'error' = 'success') {
    const isDark = document.documentElement.classList.contains('dark');

    const styles = {
        success: {
            light: {
                background: '#ecfdf5',
                color: '#064e3b',
                border: '1px solid #a7f3d0',
            },
            dark: {
                background: '#022c22',
                color: '#d1fae5',
                border: '1px solid #065f46',
            },
        },
        error: {
            light: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
            },
            dark: {
                background: '#450a0a',
                color: '#fee2e2',
                border: '1px solid #7f1d1d',
            },
        },
    };

    return isDark ? styles[type].dark : styles[type].light;
}
