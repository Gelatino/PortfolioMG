#!/usr/bin/env python3
"""
Film Page Generator
Reads films.json and generates individual HTML pages from template
Usage: python generate.py
"""

import json
import os

def load_films():
    """Load films data from JSON file"""
    with open('films.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def load_template():
    """Load the film detail template"""
    with open('film-template.html', 'r', encoding='utf-8') as f:
        return f.read()

def generate_credits_html(credits):
    """Generate HTML for credits section with optional IMDb links"""
    html = '<div class="credits-grid">\n'
    
    # Helper function to format person with optional IMDb link
    def format_person(name, imdb_id=None):
        if imdb_id:
            return f'<a href="https://www.imdb.com/name/{imdb_id}" target="_blank" class="crew-link">{name}</a>'
        return name
    
    if 'director' in credits:
        director = credits['director']
        if isinstance(director, dict):
            name_html = format_person(director['name'], director.get('imdb'))
        else:
            name_html = director
        html += f'''                    <div class="credit-item">
                        <div class="credit-role">Director</div>
                        <div class="credit-name">{name_html}</div>
                    </div>\n'''
    
    if 'writer' in credits:
        writer = credits['writer']
        if isinstance(writer, dict):
            name_html = format_person(writer['name'], writer.get('imdb'))
        else:
            name_html = writer
        html += f'''                    <div class="credit-item">
                        <div class="credit-role">Writer</div>
                        <div class="credit-name">{name_html}</div>
                    </div>\n'''
    
    if 'editor' in credits:
        editor = credits['editor']
        if isinstance(editor, dict):
            name_html = format_person(editor['name'], editor.get('imdb'))
        else:
            name_html = editor
        html += f'''                    <div class="credit-item">
                        <div class="credit-role">Editor</div>
                        <div class="credit-name">{name_html}</div>
                    </div>\n'''
    
    if 'cinematographer' in credits:
        dp = credits['cinematographer']
        if isinstance(dp, dict):
            name_html = format_person(dp['name'], dp.get('imdb'))
        else:
            name_html = dp
        html += f'''                    <div class="credit-item">
                        <div class="credit-role">Cinematographer</div>
                        <div class="credit-name">{name_html}</div>
                    </div>\n'''
    
    if 'composer' in credits:
        composer = credits['composer']
        if isinstance(composer, dict):
            name_html = format_person(composer['name'], composer.get('imdb'))
        else:
            name_html = composer
        html += f'''                    <div class="credit-item">
                        <div class="credit-role">Composer</div>
                        <div class="credit-name">{name_html}</div>
                    </div>\n'''
    
    if 'cast' in credits and credits['cast']:
        cast_names = []
        for person in credits['cast']:
            if isinstance(person, dict):
                cast_names.append(format_person(person['name'], person.get('imdb')))
            else:
                cast_names.append(person)
        cast_html = '<br>'.join(cast_names)
        html += f'''                    <div class="credit-item">
                        <div class="credit-role">Cast</div>
                        <div class="credit-name">{cast_html}</div>
                    </div>\n'''
    
    html += '                </div>'
    return html

def format_directors_note(note):
    """Format director's note with proper paragraph breaks"""
    paragraphs = note.split('\n\n')
    formatted = []
    
    for para in paragraphs:
        para = para.strip()
        if para.startswith('"') and para.endswith('"'):
            # It's a quote
            formatted.append(f'<blockquote>{para}</blockquote>')
        elif para:
            # Regular paragraph
            formatted.append(f'<p>{para}</p>')
    
    return '\n                '.join(formatted)

def generate_photos_html(photos):
    """Generate HTML for photos gallery (larger photos)"""
    if not photos:
        return ''
    
    html = '''
            <!-- Photos -->
            <div class="detail-block">
                <h3>Photos</h3>
                <div class="photos-gallery">
'''
    
    for i, photo in enumerate(photos):
        html += f'                    <img src="{photo}" alt="Photo {i+1}" class="gallery-photo" data-index="{i}">\n'
    
    html += '''                </div>
            </div>
'''
    return html

def generate_bts_html(bts_photos):
    """Generate HTML for behind-the-scenes photos (smaller)"""
    if not bts_photos:
        return ''
    
    html = '''
            <!-- Behind the Scenes -->
            <div class="detail-block">
                <h3>Behind the Scenes</h3>
                <div class="bts-gallery">
'''
    
    for i, photo in enumerate(bts_photos):
        html += f'                    <img src="{photo}" alt="Behind the scenes {i+1}" class="bts-photo" data-index="{i}">\n'
    
    html += '''                </div>
            </div>
'''
    return html

def generate_film_page(film, template):
    """Generate a single film detail page"""
    
    # Replace placeholders
    page = template.replace('{{TITLE}}', film['title'])
    page = page.replace('{{YEAR}}', film['year'])
    page = page.replace('{{RUNTIME}}', film.get('runtime', ''))
    page = page.replace('{{HERO_IMAGE}}', film['desktopGif'])
    page = page.replace('{{YOUTUBE_EMBED}}', film['youtubeEmbed'])
    page = page.replace('{{SYNOPSIS}}', film['synopsis'])
    page = page.replace('{{PHOTOS_SECTION}}', generate_photos_html(film.get('photos', [])))
    page = page.replace('{{DIRECTORS_NOTE}}', format_directors_note(film['directorsNote']))
    page = page.replace('{{CREDITS}}', generate_credits_html(film['credits']))
    page = page.replace('{{POSTER}}', film['poster'])
    page = page.replace('{{BTS_PHOTOS}}', generate_bts_html(film.get('btsPhotos', [])))
    
    return page

def main():
    """Main function to generate all film pages"""
    print("🎬 Generating film detail pages...")
    
    # Load data
    films = load_films()
    template = load_template()
    
    # Generate each film page
    for film in films:
        filename = film['detailPage']
        page_content = generate_film_page(film, template)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(page_content)
        
        print(f"✅ Generated: {filename}")
    
    print(f"\n🎉 Done! Generated {len(films)} film pages.")

if __name__ == '__main__':
    main()
