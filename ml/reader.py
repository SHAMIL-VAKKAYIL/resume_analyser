import PyPDF2
import docx


# path=r'C:\Users\ADMIN\Downloads\shamilMernStackResume (2).pdf'

def read_pdf(path):
    text = ""
    with open(path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text()
    # print(text)
    return text.lower()

# read_pdf(path)

def read_docx(path):
    doc = docx.Document(path)
    return " ".join(p.text for p in doc.paragraphs).lower()
