// Diagnostic endpoint: try to import the Express app and report the exact error
export default async function handler(req, res) {
    try {
        // Try importing the Express app - this is what crashes
        const { default: app } = await import('../server/index');
        res.status(200).json({ status: 'express loaded successfully' });
    } catch (error) {
        res.status(200).json({
            status: 'CRASH',
            errorName: error?.name,
            errorMessage: error?.message,
            errorStack: error?.stack?.split('\n').slice(0, 5),
        });
    }
}
