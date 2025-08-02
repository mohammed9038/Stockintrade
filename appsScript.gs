function doPost(e) {
  let entries = [];
  try {
    if (e.parameter.data) {
      entries = JSON.parse(e.parameter.data);
    } else {
      entries = JSON.parse(e.postData.contents);
    }

    const sheet = SpreadsheetApp.openById("1zNS074ahvESwNybnbYIvNthoXpRg64msgyNz-t1VSoI").getSheetByName("Sheet1");

    entries.forEach(row => {
      sheet.appendRow([
        new Date(),        // ⏰ Timestamp
        row.week,
        row.channel,
        row.salesman,
        row.customer,
        row.product,
        row.qty,
        row.sellout,
        row.supplier
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(
        JSON.stringify({ status: "error", message: err.message })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ✅ Add this doGet so deployment as Web App doesn't fail
function doGet() {
  return ContentService
    .createTextOutput("GET request received. Web App is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
