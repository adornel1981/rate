import os
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

# Configuration des polices
font_config = FontConfiguration()

# Styles CSS pour les PDF
css = CSS(string='''
    @font-face {
        font-family: 'Noto Sans';
        src: url('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
    }
    
    body {
        font-family: 'Noto Sans', sans-serif;
        margin: 2cm;
        line-height: 1.5;
    }
    
    h1 {
        color: #f8bbd0;
        font-size: 24pt;
        margin-bottom: 1cm;
        text-align: center;
    }
    
    h2 {
        color: #f8bbd0;
        font-size: 18pt;
        margin-top: 1cm;
        margin-bottom: 0.5cm;
    }
    
    h3 {
        color: #424242;
        font-size: 14pt;
        margin-top: 0.8cm;
        margin-bottom: 0.3cm;
    }
    
    p, ul, ol {
        margin-bottom: 0.5cm;
    }
    
    code {
        background-color: #f5f5f5;
        padding: 0.2cm;
        display: block;
        margin: 0.5cm 0;
        border-radius: 0.2cm;
        font-family: monospace;
    }
    
    .header {
        text-align: center;
        margin-bottom: 2cm;
    }
    
    .footer {
        text-align: center;
        margin-top: 2cm;
        font-size: 10pt;
        color: #757575;
    }
''', font_config=font_config)

# Fonction pour convertir un fichier Markdown en PDF
def convert_md_to_pdf(input_file, output_file):
    # Lire le contenu du fichier Markdown
    with open(input_file, 'r') as f:
        md_content = f.read()
    
    # Convertir le Markdown en HTML
    html_content = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])
    
    # Ajouter l'en-tête et le pied de page
    title = os.path.basename(input_file).replace('.md', '')
    html_content = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{title}</title>
    </head>
    <body>
        <div class="header">
            <h1>NoseDive - Application de notation inspirée de Black Mirror</h1>
        </div>
        {html_content}
        <div class="footer">
            <p>© 2025 NoseDive - Tous droits réservés</p>
        </div>
    </body>
    </html>
    '''
    
    # Générer le PDF
    HTML(string=html_content).write_pdf(output_file, stylesheets=[css], font_config=font_config)
    
    return output_file

# Convertir les guides en PDF
user_guide_pdf = convert_md_to_pdf('/home/ubuntu/proximity-rating-app/USER_GUIDE.md', 
                                  '/home/ubuntu/proximity-rating-app/NoseDive_Guide_Utilisation.pdf')

deployment_guide_pdf = convert_md_to_pdf('/home/ubuntu/proximity-rating-app/DEPLOYMENT.md', 
                                        '/home/ubuntu/proximity-rating-app/NoseDive_Guide_Deploiement.pdf')

build_instructions_pdf = convert_md_to_pdf('/home/ubuntu/proximity-rating-app/BUILD_INSTRUCTIONS.md', 
                                          '/home/ubuntu/proximity-rating-app/NoseDive_Instructions_Compilation.pdf')

print(f"Guides convertis en PDF avec succès :")
print(f"- Guide d'utilisation : {user_guide_pdf}")
print(f"- Guide de déploiement : {deployment_guide_pdf}")
print(f"- Instructions de compilation : {build_instructions_pdf}")
