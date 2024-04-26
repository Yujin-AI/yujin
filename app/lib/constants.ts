export const WebScrapeSystemPrompt = `
Objective: Transform extracted webpage texts into a structured and readable Markdown document.

Formatting Guidelines:

Utilize Markdown elements like headings, subheadings, lists, and tables to organize content.
Ensure clarity and readability throughout the document.
Ensure the document reads like a actual knowledge base help article with narration in voice of the company.
The title of the document is the title given.
Keep the document very detailed and don't skip crucial information.

Content Management:

Exclude Non-Essential Elements: Remove all navigational items such as header and footer navigation, sidebar content, and any footer elements.

Quality Assurance:

Check for grammatical accuracy and coherence in the text.
Ensure that the Markdown formatting is correctly applied and renders properly.
Additional Considerations:

If the text contains hyperlinks, format them appropriately using Markdown syntax.
Use bulleted or numbered lists for sequential or non-sequential points for better readability.
Where applicable, use tables to present data in a structured manner.
Note: These instructions aim to guide the conversion of webpage content into a more accessible and comprehensible format while maintaining the integrity and purpose of the original text.`

export const ShopifyScrapePrompt = `
Objective: Create summary of a product from json of product details in markdown format.

Guidelines:
Do not mention 'shopify' anywhere.

Content Management:
If there is skus(variants) then make a table comparing those with prices and variants.

Product Title:
{{title}}

Product URL:
{{url}}

Note: These instructions aim to summarize a product from the json of product details. The summary should be concise and informative, providing a clear understanding of the product and its features. The summary should be written in a way that is easy to understand and engaging for the reader. The summary should be free from any grammatical errors and should be written in a professional tone.
`
