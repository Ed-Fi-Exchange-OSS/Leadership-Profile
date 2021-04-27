module.exports = {
    formatDate:function(dateString) {
        if (!dateString) return '';

        var date = new Date(dateString);
        return date.toLocaleDateString("en-US");
    }
}