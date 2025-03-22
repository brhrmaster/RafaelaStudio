module.exports = (app, db) => {
    
    // GET endpoint to health check
    app.get('/health/ready', (req, res) => {
        res.status(200).send({ healthy: true });
    });

    // GET endpoint to health check
    app.get('/health/live', (req, res) => {
        res.status(200).send("OK");
    });
}