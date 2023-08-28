function IngestDateService() {
    function getLastIngestionDate() {
        return {
            "ISD": "Garland ISD",
            "Date": new Date("2023-07-03T14:34:08.000Z"),
            "ItemsProccessed": 1234
        };
    }

    return { getLastIngestionDate };
}

export default IngestDateService;