export default defineTask({
  meta: {
    name: "scannedPages:process",
    description: "Process scanned pages",
  },
  async run() {
    console.log("Processing scanned pages");
    const { getPendingPages, extractPageText } = await useScannedPagesService();

    const scannedPages = await getPendingPages();

    const res = await Promise.all(
      scannedPages.map(async (page) => {
        try {
          const result = await extractPageText(page);
          console.log(
            "Processed page " + result.id + "status: " + result.status
          );
        } catch (error) {
          console.error("Error processing page " + page.id, error);
        }
      })
    );
    console.log(res.length + " pages processed");
  },
});
