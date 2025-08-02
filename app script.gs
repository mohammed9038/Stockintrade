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
        new Date(),               // ⏰ Add timestamp here
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
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    }
  }

