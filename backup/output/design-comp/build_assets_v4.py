from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
SOURCE = Path(r"C:\Users\wasab\Downloads\ChatGPT Image 2026年6月10日 11_41_47.png")
OUT = ROOT / "assets-v4"
OUT.mkdir(parents=True, exist_ok=True)


def crop_alpha(box, threshold=242):
    """Crop a sheet region and remove only near-white pixels connected to its edges."""
    im = Image.open(SOURCE).convert("RGBA").crop(box)
    px = im.load()
    w, h = im.size
    seen = bytearray(w * h)
    q = deque()

    def is_bg(x, y):
        r, g, b, _ = px[x, y]
        return r >= threshold and g >= threshold and b >= threshold

    def add(x, y):
        i = y * w + x
        if not seen[i] and is_bg(x, y):
            seen[i] = 1
            q.append((x, y))

    for x in range(w):
        add(x, 0)
        add(x, h - 1)
    for y in range(h):
        add(0, y)
        add(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (*px[x, y][:3], 0)
        if x:
            add(x - 1, y)
        if x + 1 < w:
            add(x + 1, y)
        if y:
            add(x, y - 1)
        if y + 1 < h:
            add(x, y + 1)

    alpha = im.getchannel("A")
    bbox = alpha.getbbox()
    return im.crop(bbox) if bbox else im


def place(canvas_size, items, output_name):
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    for image, max_size, position in items:
        item = image.copy()
        scale = min(max_size[0] / item.width, max_size[1] / item.height)
        item = item.resize(
            (max(1, round(item.width * scale)), max(1, round(item.height * scale))),
            Image.Resampling.LANCZOS,
        )
        if position == "center":
            x = (canvas.width - item.width) // 2
            y = (canvas.height - item.height) // 2
        else:
            x, y = position
        canvas.alpha_composite(item, (x, y))
    canvas.save(OUT / output_name)


# Existing cut illustrations from the supplied sheet.
meeting = crop_alpha((35, 125, 390, 345))
proposal_person = crop_alpha((420, 130, 650, 350))
analysis = crop_alpha((690, 130, 995, 350))
meeting_three = crop_alpha((35, 420, 390, 620))
visualize = crop_alpha((415, 425, 660, 625))
support = crop_alpha((690, 425, 990, 625))
process = crop_alpha((30, 940, 995, 1145))
documents = crop_alpha((30, 1180, 190, 1335))
checklist = crop_alpha((195, 1180, 355, 1335))
security = crop_alpha((365, 1180, 520, 1335))
communication = crop_alpha((525, 1180, 685, 1335))
goal = crop_alpha((820, 1180, 995, 1335))
think = crop_alpha((30, 1370, 180, 1525))
explain = crop_alpha((365, 1370, 520, 1525))
ok_person = crop_alpha((535, 1370, 680, 1525))
pc_work = crop_alpha((845, 1370, 1005, 1525))

# HERO: a composed visual made exclusively from the supplied asset sheet.
place(
    (1254, 1254),
    [
        (meeting, (730, 390), (440, 620)),
        (proposal_person, (330, 360), (765, 225)),
        (security, (210, 210), (940, 610)),
        (communication, (190, 190), (580, 395)),
        (checklist, (190, 190), (750, 510)),
    ],
    "hero.png",
)

# Large horizontal sections.
place((1846, 852), [(process, (1660, 650), "center")], "system-background.png")
place(
    (1983, 793),
    [
        (documents, (320, 300), (190, 270)),
        (checklist, (320, 300), (590, 270)),
        (security, (320, 300), (990, 270)),
        (visualize, (410, 340), (1410, 245)),
    ],
    "scs-explanation.png",
)

# Five service-step assets.
place((1254, 1254), [(meeting, (1030, 680), "center")], "step-01-current-review.png")
place((1254, 1254), [(analysis, (980, 690), "center")], "step-02-gap-analysis.png")
place((1254, 1254), [(proposal_person, (720, 800), "center")], "step-03-plan.png")
place((1254, 1254), [(pc_work, (680, 660), (300, 330)), (ok_person, (330, 330), (760, 260))], "step-04-operation.png")
place((1254, 1254), [(goal, (650, 650), (450, 340)), (checklist, (350, 350), (180, 460))], "step-05-achievement.png")

# Proposal section.
place(
    (1774, 887),
    [
        (support, (570, 470), (95, 230)),
        (communication, (350, 350), (710, 250)),
        (goal, (470, 470), (1200, 210)),
    ],
    "proposal.png",
)
