import os

def update_vite_config(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'base:' not in content:
        content = content.replace('defineConfig({', "defineConfig({\n  base: './',")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

base_dir = r'c:\Users\yorze\OneDrive\Documentos\Fuxion'
react_apps = [
    os.path.join(base_dir, 'RANGO_2_PROFESIONAL', 'CATEGORIA_A_ESTETICO', 'vite.config.js'),
    os.path.join(base_dir, 'RANGO_2_PROFESIONAL', 'CATEGORIA_B_PRE_PEDIDO_WHATSAPP', 'vite.config.js'),
    os.path.join(base_dir, 'RANGO_2_PROFESIONAL', 'CATEGORIA_C_COMBO_MARCA', 'vite.config.js'),
    os.path.join(base_dir, 'RANGO_3_PREMIUM', 'CATEGORIA_A_AUTOR', 'vite.config.js'),
]

for app in react_apps:
    update_vite_config(app)
    
print("Vite configs updated with base: './'")
