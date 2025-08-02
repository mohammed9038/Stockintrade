function doPost(e) {
  try {
    let entries = [];
    
    // Handle different types of POST data
    if (e.parameter && e.parameter.data) {
      // Form data submission
      entries = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      // Direct JSON submission
      entries = JSON.parse(e.postData.contents);
    } else {
      throw new Error("No data received");
    }

    // Validate that we have entries
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error("No valid entries found");
    }

    const sheet = SpreadsheetApp.openById("1zNS074ahvESwNybnbYIvNthoXpRg64msgyNz-t1VSoI").getSheetByName("Sheet1");

    // Add each entry to the sheet
    entries.forEach(row => {
      sheet.appendRow([
        new Date(),               // Timestamp
        row.week || '',
        row.channel || '',
        row.salesman || '',
        row.customer || '',
        row.product || '',
        row.qty || 0,
        row.sellout || 0,
        row.supplier || ''
      ]);
    });

    // Log success for debugging
    console.log(`Successfully added ${entries.length} entries to sheet`);

    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: "success", 
        message: `${entries.length} entries added successfully` 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    // Log error for debugging
    console.error('Apps Script error:', err.message);
    
    return ContentService
      .createTextOutput(
        JSON.stringify({ 
          status: "error", 
          message: err.message 
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}

