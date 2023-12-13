function IngestDateService() {
    function getLastIngestionDate() {
        return {
            "ISD": "Garland ISD",
            "Date": new Date("2023-10-25T14:34:08.000Z"),
            "ItemsProccessed": 1580
        };
    }

    return { getLastIngestionDate };
}

export default IngestDateService;