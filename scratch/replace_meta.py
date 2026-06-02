import re
import os

calendar_svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
clock_svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
user_svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'

blog_dir = '/Users/gax8627/Legal Guide/blog'

for filename in os.listdir(blog_dir):
    if filename == 'index.html' or not filename.endswith('.html'):
        continue
    filepath = os.path.join(blog_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the article-meta div
    meta_match = re.search(r'<div class="article-meta">([\s\S]*?)</div>', content)
    if meta_match:
        inner_content = meta_match.group(1)
        
        # Extract Date
        date_match = re.search(r'<span>📅\s*(.*?)</span>', inner_content)
        date = date_match.group(1).strip() if date_match else ''
        
        # Extract Read Time
        read_time_match = re.search(r'<span>(?:\s*⏱\s*)?\s*(.*?)</span>', inner_content)
        # Note: the above might match the date if it's the first span, so let's be more specific:
        # Let's search inside the second span or filter by "min de lectura"
        spans = re.findall(r'<span>([\s\S]*?)</span>', inner_content)
        
        date = ''
        read_time = ''
        author = ''
        
        for s in spans:
            s_clean = s.strip()
            if '📅' in s_clean or re.search(r'\d{1,2}\s+de\s+[a-zA-Z]+\s+de\s+\d{4}', s_clean):
                date = s_clean.replace('📅', '').strip()
            elif 'min' in s_clean or 'lectura' in s_clean or '⏱' in s_clean:
                read_time = s_clean.replace('⏱', '').strip()
            elif '✍' in s_clean or 'Guía' in s_clean:
                author = s_clean.replace('✍', '').strip()
        
        if not date or not read_time or not author:
            print(f"Warning: could not fully parse {filename}: date='{date}', read_time='{read_time}', author='{author}'")
            continue
            
        new_meta = f'''<div class="article-meta">
      <span>{calendar_svg} {date}</span>
      <span>{clock_svg} {read_time}</span>
      <span>{user_svg} {author}</span>
    </div>'''
        
        # Replace in content
        updated_content = content.replace(meta_match.group(0), new_meta)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Successfully updated {filename}")
