import os

base_dir = r'c:\Users\yorze\OneDrive\Documentos\Fuxion'

# 1. Rango 1 Cat A
r1_a = os.path.join(base_dir, 'RANGO_1_ECONOMICO', 'CATEGORIA_A_BASICO', 'index.html')
with open(r1_a, 'r', encoding='utf-8') as f: content = f.read()
if 'target="_blank"' not in content.split('Consultar por WhatsApp')[0]:
    content = content.replace('href="https://wa.me/', 'target="_blank" rel="noreferrer" href="https://wa.me/')
    with open(r1_a, 'w', encoding='utf-8') as f: f.write(content)

# 2. Rango 1 Cat B
r1_b = os.path.join(base_dir, 'RANGO_1_ECONOMICO', 'CATEGORIA_B_QR_PRO', 'index.html')
with open(r1_b, 'r', encoding='utf-8') as f: content = f.read()
if 'target="_blank"' not in content.split('Consultar por WhatsApp')[0]:
    content = content.replace('href="https://wa.me/', 'target="_blank" rel="noreferrer" href="https://wa.me/')
    with open(r1_b, 'w', encoding='utf-8') as f: f.write(content)

# 3. Rango 1 Cat C
r1_c = os.path.join(base_dir, 'RANGO_1_ECONOMICO', 'CATEGORIA_C_AUTOADMINISTRABLE_MANUAL', 'app.js')
with open(r1_c, 'r', encoding='utf-8') as f: content = f.read()
if 'waBtn.target' not in content:
    content = content.replace("waBtn.classList.remove('hidden');", "waBtn.target = '_blank';\n    waBtn.rel = 'noreferrer';\n    waBtn.classList.remove('hidden');")
    with open(r1_c, 'w', encoding='utf-8') as f: f.write(content)

# 4. Rango 2 Cat A
r2_a = os.path.join(base_dir, 'RANGO_2_PROFESIONAL', 'CATEGORIA_A_ESTETICO', 'src', 'App.jsx')
with open(r2_a, 'r', encoding='utf-8') as f: content = f.read()
if 'target="_blank"' not in content.split('Contactar por WhatsApp')[0]:
    content = content.replace('href={`https://wa.me/', 'target="_blank" rel="noreferrer" href={`https://wa.me/')
    with open(r2_a, 'w', encoding='utf-8') as f: f.write(content)

# 5. Rango 2 Cat B
r2_b = os.path.join(base_dir, 'RANGO_2_PROFESIONAL', 'CATEGORIA_B_PRE_PEDIDO_WHATSAPP', 'src', 'App.jsx')
with open(r2_b, 'r', encoding='utf-8') as f: content = f.read()
if 'window.open' not in content:
    content = content.replace('window.location.href = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`;', 'window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");')
    with open(r2_b, 'w', encoding='utf-8') as f: f.write(content)

# 6. Rango 2 Cat C
r2_c = os.path.join(base_dir, 'RANGO_2_PROFESIONAL', 'CATEGORIA_C_COMBO_MARCA', 'src', 'App.jsx')
with open(r2_c, 'r', encoding='utf-8') as f: content = f.read()
if 'window.open' not in content:
    content = content.replace('window.location.href = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`;', 'window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");')
    with open(r2_c, 'w', encoding='utf-8') as f: f.write(content)

# 7. Rango 3 Cat A
r3_a = os.path.join(base_dir, 'RANGO_3_PREMIUM', 'CATEGORIA_A_AUTOR', 'src', 'App.jsx')
with open(r3_a, 'r', encoding='utf-8') as f: content = f.read()
if 'target="_blank"' not in content.split('Reservar / Consultar')[0]:
    content = content.replace('href={`https://wa.me/', 'target="_blank" rel="noreferrer" href={`https://wa.me/')
    with open(r3_a, 'w', encoding='utf-8') as f: f.write(content)

print("Fixed WhatsApp links successfully.")
