import zlib, struct, math, os

def create_png(w, h, color_fn, filename):
    raw_data = bytearray()
    for y in range(h):
        raw_data.append(0) # filter type none
        for x in range(w):
            r, g, b, a = color_fn(x, y, w, h)
            raw_data.extend([r, g, b, a])
    
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
    os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png)

def draw_icon(x, y, w, h, is_maskable=False):
    # Normalized coords from -1 to 1
    scale = 0.75 if is_maskable else 0.90
    nx = (x - w/2) / (w/2 * scale)
    ny = (y - h/2) / (h/2 * scale)

    # Base background: deep modern midnight
    bg_r, bg_g, bg_b = 15, 23, 42  # #0f172a

    # Check if inside squircle/shield
    # Shield boundary:
    # top: ny >= -0.75
    # sides: abs(nx) <= 0.7
    # bottom: pointy arc
    in_shield = False
    if ny >= -0.75 and ny <= 0.85:
        # width narrows down as ny goes positive
        if ny <= 0.1:
            max_x = 0.65
        else:
            # tapers down to 0 at ny=0.85
            t = (ny - 0.1) / 0.75
            max_x = 0.65 * (1.0 - t**1.4)
        if abs(nx) <= max_x:
            in_shield = True

    # Center glow
    dist = math.sqrt(nx*nx + (ny+0.1)*(ny+0.1))
    glow = max(0.0, 1.0 - dist / 1.1)

    if in_shield:
        # Inner shield color with teal gradient
        t = (ny + 0.75) / 1.6
        s_r = int(24 + 18 * t)
        s_g = int(35 + 90 * (1 - t) + 40 * glow)
        s_b = int(50 + 120 * glow)
        
        # Border check
        border_thickness = 0.08
        is_border = False
        if abs(nx) > (max_x - border_thickness) or ny < (-0.75 + border_thickness) or ny > (0.85 - border_thickness):
            is_border = True

        if is_border:
            # Teal glowing border
            return (45, 212, 191, 255)

        # Rupee symbol drawing
        # Top bar: ny between -0.42 and -0.34, nx between -0.32 and 0.32
        in_rupee = False
        if -0.44 <= ny <= -0.34 and -0.32 <= nx <= 0.32:
            in_rupee = True
        # Second bar: ny between -0.22 and -0.14, nx between -0.32 and 0.18
        elif -0.24 <= ny <= -0.14 and -0.32 <= nx <= 0.18:
            in_rupee = True
        # Vertical stem: nx between -0.18 and -0.08, ny between -0.44 and 0.08
        elif -0.18 <= nx <= -0.08 and -0.44 <= ny <= 0.08:
            in_rupee = True
        # Upper arc
        elif -0.44 <= ny <= 0.08 and -0.08 <= nx <= 0.30:
            arc_r = math.sqrt((nx - 0.05)**2 + (ny + 0.18)**2)
            if 0.16 <= arc_r <= 0.26 and nx >= 0.05:
                in_rupee = True
        # Diagonal leg: from (-0.08, 0.08) to (0.32, 0.52)
        elif 0.05 <= ny <= 0.52 and -0.08 <= nx <= 0.32:
            diag_pos = (ny - 0.05) / 0.47
            expected_x = -0.08 + diag_pos * 0.38
            if abs(nx - expected_x) <= 0.07:
                in_rupee = True

        if in_rupee:
            return (255, 255, 255, 255)

        return (min(255, s_r), min(255, s_g), min(255, s_b), 255)

    # Outside shield, background with subtle gradient
    r = int(bg_r + glow * 15)
    g = int(bg_g + glow * 35)
    b = int(bg_b + glow * 45)
    return (min(255, r), min(255, g), min(255, b), 255)

print("Generating 192x192 icon...")
create_png(192, 192, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/pwa-192x192.png')

print("Generating 512x512 icon...")
create_png(512, 512, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/pwa-512x512.png')

print("Generating 512x512 maskable icon...")
create_png(512, 512, lambda x, y, w, h: draw_icon(x, y, w, h, True), 'public/pwa-maskable-512x512.png')

print("Generating 180x180 apple touch icon...")
create_png(180, 180, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/apple-touch-icon.png')

print("Generating favicon...")
create_png(64, 64, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/favicon.ico')

print("All PWA icons created successfully!")
