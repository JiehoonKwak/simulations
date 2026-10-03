import hashlib
import json
import platform
import re
import xml.etree.ElementTree as ET
from pathlib import Path

import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.colors import LinearSegmentedColormap, TwoSlopeNorm
from matplotlib.lines import Line2D
from matplotlib.patches import Patch
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/figures'
OUT.mkdir(parents=True, exist_ok=True)
REPORT = ROOT / 'artifacts/scenario-report.json'
report = json.loads(REPORT.read_text())
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
font = font_manager.findfont('Arial', fallback_to_default=False)
plt.rcParams.update({'font.family': 'Arial', 'font.size': 8, 'axes.labelsize': 9,
                     'axes.labelweight': 'bold', 'axes.titlesize': 8,
                     'axes.linewidth': .6, 'xtick.major.width': .6,
                     'ytick.major.width': .6, 'xtick.major.size': 2.5,
                     'ytick.major.size': 2.5, 'pdf.fonttype': 42,
                     'svg.fonttype': 'none', 'savefig.facecolor': 'white'})
COLORS = {'proprietor': '#AC765C', 'salaried': '#658B82'}
LABELS = {'reference': 'Assistive care', 'hold': 'No additional change',
          'shared': 'Shared productivity', 'concentrated': 'Unequal gain sharing',
          'demand': 'Payment and demand squeeze', 'automation': 'High automation'}
manifest = {
    'state': 'review_candidate', 'mode': 'standalone_scientific_assets',
    'target': 'Project print profile; no named journal submission',
    'scientific_object': 'Deterministic conditional scenario, not a sampled person or institution',
    'source_report': {'path': str(REPORT.relative_to(ROOT)), 'sha256': sha(REPORT)},
    'model_version': report['version'], 'model_sha256': report['modelHash'],
    'input_sha256': report['inputHashes'],
    'analysis_helper_sha256': report['analysisHashes'],
    'generation': {'path': 'scripts/plot-results.py', 'sha256': sha(Path(__file__)),
                   'command': 'uv run python scripts/plot-results.py'},
    'software': {'python': platform.python_version(), 'matplotlib': matplotlib.__version__,
                 'numpy': np.__version__, 'font_file': font, 'font_sha256': sha(Path(font))},
    'profile': {'width_mm': 168, 'font': 'Arial', 'axis_pt': 9, 'tick_legend_pt': 8,
                'axis_weight': 'bold', 'png_dpi': 300, 'proof_dpi': 100,
                'background': 'white', 'vector_text': 'editable PDF TrueType and SVG text'},
    'figures': {
        'role-earnings': {
            'height_mm': 116,
            'question': 'How do paired role earnings trajectories differ across declared scenarios?',
            'criterion': 'Compare role paths on common axes and against their own initial index of 100.',
            'metric': 'Own-role earnings index in the original modeled practice; 2026=100',
            'groups': ['proprietor', 'salaried'], 'eligibility': 'All six report scenarios; all eleven annual frames; both roles',
            'dimensions_shown': ['scenario', 'year', 'role', 'finite design extrema'],
            'uncertainty': 'Pointwise min-max across declared design, not a confidence interval',
            'aggregation': 'Each role is a model group; no person-level distribution is implied',
            'geometry': '2 rows by 3 equal facets; shared x and y scales',
            'composite_reason': 'Common-scale simultaneous trajectory comparison across all scenarios',
            'primary_marks': 'Solid proprietor and dashed salaried trajectories',
            'comparison_marks': 'Role-colored min-max ribbons; own-role baseline at 100',
            'color_role_map': COLORS,
            'displayed_text': list(LABELS.values()) + ['Proprietor', 'Salaried', 'Design range', 'Year',
                               'Earnings index (2026 = 100)', '2026', '2031', '2036', '0', '50', '100', '150'],
            'off_panel_evidence': 'artifacts/figure-captions.md',
        },
        'role-gap-thresholds': {
            'height_mm': 91,
            'question': 'Where does the proprietor-to-salaried earnings ratio widen or narrow?',
            'criterion': 'Positive ratio change indicates widening; zero contour marks unchanged ratio.',
            'metric': '100 * [(2036 proprietor/salaried ratio)/(baseline ratio) - 1]',
            'eligibility': 'All threshold cells; central balanced task mix; staffing 0, 0.5, 1',
            'dimensions_shown': ['demand change', 'salaried gain participation', 'staffing response', 'role ratio change'],
            'fixed_parameters': 'Concentrated preset; proprietor participation 0.8; capacity growth 60%; balanced task mix',
            'uncertainty': 'No interval; other task profiles retained in source report, not pooled into color',
            'geometry': 'Three equal facets; shared axes and zero-centered color scale',
            'composite_reason': 'Compare the same response surface under three staffing rules',
            'primary_marks': 'Cell-centered heatmap without data interpolation; absolute changes below 1e-8 percentage points snapped to zero to suppress floating-point contour artifacts',
            'comparison_marks': 'Labeled contours at -5, 0, 10, 20 percentage points; zero heavier',
            'displayed_text': ['Staffing response = 0', 'Staffing response = 0.5', 'Staffing response = 1',
                               'Demand change (%)', 'Salaried gain participation', 'Role-ratio change (%)',
                               '−40', '−20', '0', '20', '40', '60', '0.0', '0.5', '1.0',
                               '−32', '−16', '16', '32', '-5', '10', '-40', '-20', '-32', '-16'],
            'off_panel_evidence': 'artifacts/figure-captions.md',
        },
    },
    'acceptance': ['two main and two supplemental standalone figures', '168 mm exact canvas width', 'source-native unchanged values',
                   'readable decoding text only', 'no clipping', 'role linetypes and labeled contours survive grayscale'],
    'review': {'scientific': 'Source fields and definitions checked; empirical and structural assumptions remain conditional',
               'visual': 'Awaiting current rendered proof inspection', 'user_acceptance': 'not requested'},
}
MATCHED_LABELS = {c['id']: c['label'] for c in report['comparisons']}
manifest['figures'].update({
    'matched-comparisons': {
        'height_mm': 116, 'role': 'main',
        'question': 'How do demand, staffing and gain participation alter earnings per original role member under matched technology?',
        'criterion': 'Own-role 2036 earnings index at least 100 means maintenance of original-member remuneration.',
        'metric': 'Own-role earnings per original member, 2026=100',
        'eligibility': 'All four matched comparisons, both roles and all eleven years',
        'dimensions_shown': ['matched comparison', 'year', 'role', 'finite parameter-grid extrema'],
        'uncertainty': 'Pointwise range across 243 finite parameter combinations; not CI; excludes compensation-rule countermodel',
        'geometry': '2 by 2 shared-axis facets; y limits75 to145',
        'composite_reason': 'Matched technology permits ordered demand, staffing and gain-participation comparisons.',
        'color_role_map': COLORS,
        'displayed_text': list(MATCHED_LABELS.values()) + ['Proprietor', 'Salaried', 'Design range', 'Year',
                           'Earnings index (2026 = 100)', '2026', '2031', '2036', '80', '100', '120', '140'],
        'off_panel_evidence': 'artifacts/figure-captions.md',
    },
    'earnings-maintenance': {
        'height_mm': 142, 'role': 'main',
        'question': 'What demand growth maintains original-group earnings at 2036 under alternative participation and compensation rules?',
        'criterion': 'Minimum purchased-care demand growth with endpoint own-role original-member earnings index >=100',
        'metric': 'Minimum demand growth (%); unavailable retained as null and encoded only in nonnumeric strips',
        'eligibility': 'Balanced task profile, capacity20/40, staffing0/0.5/1, both rules, all101 gain shares',
        'dimensions_shown': ['capacity', 'staffing', 'gain share', 'compensation rule', 'required demand', 'reachability'],
        'uncertainty': 'Deterministic thresholds; no CI; alternative task profiles retained in numerical report',
        'geometry': 'Capacity rows and staffing columns; each facet includes a separate two-row reachability strip',
        'composite_reason': 'Common-scale comparisons isolate capacity, staffing and compensation-rule changes.',
        'null_encoding': 'Absent numeric curve; x-hatched strip over unavailable sampled gain shares (R or G). No sentinel ordinate.',
        'displayed_text': ['Staffing response = 0', 'Staffing response = 0.5', 'Staffing response = 1',
                           'Capacity +20%', 'Capacity +40%', 'Required demand growth (%)',
                           'Gain participation', 'Retained rights (R)', 'Growth only (G)', 'Not reachable',
                           'R', 'G', '0', '10', '20', '30', '40', '0.0', '0.5', '1.0'],
        'off_panel_evidence': 'artifacts/figure-captions.md',
    },
})
for name in ['role-earnings', 'role-gap-thresholds']:
    manifest['figures'][name]['role'] = 'supplemental'

manifest_path = OUT / 'manifest.json'
previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')


def save(fig, name):
    fig.canvas.draw()
    visible = sorted({text.get_text() for text in fig.findobj(matplotlib.text.Text)
                      if text.get_visible() and text.get_text()})
    manifest['figures'][name]['rendered_text'] = visible
    forbidden = set(visible) - set(manifest['figures'][name]['displayed_text'])
    if forbidden:
        raise ValueError(f'Unexpected figure text: {forbidden}')
    for ext in ['pdf', 'svg', 'png']:
        fig.savefig(OUT / f'{name}.{ext}', dpi=300)
    proof = OUT / f'{name}-proof.png'
    fig.savefig(proof, dpi=100)
    with Image.open(proof) as image:
        image.convert('L').save(OUT / f'{name}-grayscale.png')
    manifest['figures'][name]['actual_inches'] = fig.get_size_inches().tolist()
    plt.close(fig)


fig, axes = plt.subplots(2, 3, figsize=(168/25.4, 116/25.4), sharex=True, sharey=True)
fig.subplots_adjust(left=.112, right=.978, bottom=.14, top=.875, wspace=.22, hspace=.43)
for ax, scenario in zip(axes.flat, report['scenarios']):
    for role in ['proprietor', 'salaried']:
        points = [r for r in report['trajectories'] if r['scenario'] == scenario['id'] and r['group'] == role]
        points.sort(key=lambda p: p['year'])
        years = [p['year'] for p in points]
        envelope = [next(g for g in f['groups'] if g['id'] == role)['earnings']
                    for f in scenario['envelope']['frames']]
        ax.fill_between(years, [g['min'] for g in envelope], [g['max'] for g in envelope],
                        color=COLORS[role], alpha=.14, linewidth=0)
        ax.plot(years, [p['earnings'] for p in points], color=COLORS[role],
                linestyle='-' if role == 'proprietor' else (0, (3, 2)), linewidth=1.5)
    ax.axhline(100, color='#989898', linewidth=.55, linestyle=(0, (2, 3)), zorder=0)
    ax.set_title(LABELS[scenario['id']], pad=8, loc='left')
    ax.set(xlim=(2026,2036), ylim=(0,150), xticks=[2026,2031,2036], yticks=[0,50,100,150])
    ax.spines[['top','right']].set_visible(False)
fig.supxlabel('Year', y=.035, fontsize=9, fontweight='bold')
fig.supylabel('Earnings index (2026 = 100)', x=.018, fontsize=9, fontweight='bold')
fig.legend(handles=[Line2D([],[], color=COLORS['proprietor'],lw=1.5,label='Proprietor'),
                    Line2D([],[],color=COLORS['salaried'],lw=1.5,ls=(0,(3,2)),label='Salaried'),
                    Patch(facecolor='#c6c6c6',alpha=.6,label='Design range')],
           loc='upper center', bbox_to_anchor=(.55,.985), frameon=False,ncol=3,handlelength=2.3)
save(fig,'role-earnings')

fig, axes = plt.subplots(1,3,figsize=(168/25.4,91/25.4),sharex=True,sharey=True)
fig.subplots_adjust(left=.112,right=.978,bottom=.36,top=.88,wspace=.15)
demands=sorted({r['demand'] for r in report['thresholdGrid']})
participation=sorted({r['salariedParticipation'] for r in report['thresholdGrid']})
cmap=LinearSegmentedColormap.from_list('gap',['#286b72','#f5f5f1','#ae623f'])
norm=TwoSlopeNorm(vmin=-32,vcenter=0,vmax=32)
for ax, staffing in zip(axes,[0,.5,1]):
    rows=[r for r in report['thresholdGrid'] if r['staffing']==staffing]
    lookup={(r['demand'],r['salariedParticipation']):r['gapChange'] for r in rows}
    z=np.array([[lookup[d,p] for d in demands] for p in participation])
    z[np.abs(z)<1e-8]=0
    mesh=ax.pcolormesh(demands,participation,z,cmap=cmap,norm=norm,shading='nearest',rasterized=False)
    levels=[value for value in [-5,0,10,20] if z.min()<value<z.max()]
    contours=ax.contour(demands,participation,z,levels=levels,colors='#39413f',
                        linewidths=[.95 if value==0 else .5 for value in levels],
                        linestyles=['solid' if value>=0 else 'dashed' for value in levels])
    ax.clabel(contours,fmt='%g',fontsize=8,inline=True,inline_spacing=2)
    ax.set_title(f'Staffing response = {staffing:g}',loc='left',pad=8)
    ax.set(xlim=(-40,60),ylim=(0,1),xticks=[-40,0,60],yticks=[0,.5,1])
    ax.tick_params(axis='x',pad=3)
    ax.spines[['top','right']].set_visible(False)
fig.supylabel('Salaried gain participation',x=.018,fontsize=9,fontweight='bold')
fig.supxlabel('Demand change (%)',y=.235,fontsize=9,fontweight='bold')
cax=fig.add_axes([.30,.107,.51,.036])
bar=fig.colorbar(mesh,cax=cax,orientation='horizontal',ticks=[-32,-16,0,16,32])
bar.outline.set_linewidth(.5)
bar.set_label('Role-ratio change (%)',fontsize=9,fontweight='bold',labelpad=5)
save(fig,'role-gap-thresholds')

fig, axes = plt.subplots(2, 2, figsize=(168/25.4,116/25.4),sharex=True,sharey=True)
fig.subplots_adjust(left=.112,right=.978,bottom=.14,top=.875,wspace=.19,hspace=.43)
for ax, comparison in zip(axes.flat, report['comparisons']):
    for role in ['proprietor','salaried']:
        points = sorted([p for p in report['comparisonTrajectories']
                         if p['scenario']==comparison['id'] and p['group']==role],key=lambda p:p['year'])
        years = [p['year'] for p in points]
        envelope = [next(g for g in f['groups'] if g['id']==role)['earnings']
                    for f in comparison['envelope']['frames']]
        ax.fill_between(years,[e['min'] for e in envelope],[e['max'] for e in envelope],
                        color=COLORS[role],alpha=.14,linewidth=0)
        ax.plot(years,[p['earnings'] for p in points],color=COLORS[role],lw=1.5,
                ls='-' if role=='proprietor' else (0,(3,2)))
    ax.axhline(100,color='#989898',lw=.55,ls=(0,(2,3)),zorder=0)
    ax.set_title(MATCHED_LABELS[comparison['id']],loc='left',pad=8)
    ax.set(xlim=(2026,2036),ylim=(75,145),xticks=[2026,2031,2036],yticks=[80,100,120,140])
    ax.spines[['top','right']].set_visible(False)
fig.supxlabel('Year',y=.035,fontsize=9,fontweight='bold')
fig.supylabel('Earnings index (2026 = 100)',x=.018,fontsize=9,fontweight='bold')
fig.legend(handles=[Line2D([],[],color=COLORS['proprietor'],lw=1.5,label='Proprietor'),
                    Line2D([],[],color=COLORS['salaried'],lw=1.5,ls=(0,(3,2)),label='Salaried'),
                    Patch(facecolor='#c6c6c6',alpha=.6,label='Design range')],
           loc='upper center',bbox_to_anchor=(.55,.985),frameon=False,ncol=3,handlelength=2.3)
save(fig,'matched-comparisons')

fig = plt.figure(figsize=(168/25.4,142/25.4))
outer = fig.add_gridspec(2,3,left=.14,right=.98,bottom=.14,top=.87,wspace=.23,hspace=.36)
for row, capacity in enumerate([20,40]):
    for col, staffing in enumerate([0,.5,1]):
        inner = outer[row,col].subgridspec(2,1,height_ratios=[1,.19],hspace=.035)
        ax = fig.add_subplot(inner[0])
        strip = fig.add_subplot(inner[1],sharex=ax)
        for rule, style, ypos in [('retained-rights','-',1),('growth-only',(0,(3,2)),0)]:
            points = sorted([r for r in report['maintenanceCurves'] if r['profile']=='balanced'
                             and r['capacityGrowth']==capacity and r['staffingResponse']==staffing
                             and r['rule']==rule],key=lambda r:r['gainShare'])
            x=np.array([r['gainShare'] for r in points])
            y=np.array([r['minimumDemandGrowth'] if r['minimumDemandGrowth'] is not None else np.nan for r in points])
            ax.plot(x,y,color='#394e53',ls=style,lw=1.35)
            unavailable=np.isnan(y)
            indices=np.flatnonzero(unavailable)
            if len(indices):
                runs=np.split(indices,np.where(np.diff(indices)>1)[0]+1)
                for group in runs:
                    left=max(0,x[group[0]]-.005);right=min(1,x[group[-1]]+.005)
                    strip.add_patch(plt.Rectangle((left,ypos-.34),right-left,.68,
                                    facecolor='#eceeec',edgecolor='#7e8885',lw=.35,hatch='xxxx'))
        ax.set(xlim=(0,1),ylim=(0,40),yticks=[0,10,20,30,40])
        ax.spines[['top','right']].set_visible(False)
        ax.tick_params(axis='x',bottom=False,labelbottom=False)
        if col: ax.tick_params(axis='y',labelleft=False)
        if row==0: ax.set_title(f'Staffing response = {staffing:g}',loc='left',pad=9)
        strip.set(ylim=(-.6,1.6),yticks=[1,0],yticklabels=['R','G'],xticks=[0,.5,1])
        strip.spines[['top','right','left']].set_visible(False)
        strip.tick_params(axis='y',length=0,pad=3)
        if row==0: strip.tick_params(axis='x',labelbottom=False)
    fig.text(.065,.705 if row==0 else .345,f'Capacity +{capacity}%',rotation=90,
             ha='center',va='center',fontsize=8)
fig.supylabel('Required demand growth (%)',x=.013,fontsize=9,fontweight='bold')
fig.supxlabel('Gain participation',y=.045,fontsize=9,fontweight='bold')
fig.legend(handles=[Line2D([],[],color='#394e53',lw=1.35,label='Retained rights (R)'),
                    Line2D([],[],color='#394e53',lw=1.35,ls=(0,(3,2)),label='Growth only (G)'),
                    Patch(facecolor='#eceeec',edgecolor='#7e8885',lw=.35,hatch='xxxx',label='Not reachable')],
           loc='upper center',bbox_to_anchor=(.54,.982),frameon=False,ncol=3,handlelength=2.4,columnspacing=1.6)
save(fig,'earnings-maintenance')

captions='''# Figure captions

## Main figure: Matched technology, different economic choices

Solid clay and dashed sage trajectories show earnings per original proprietor or salaried group member, each normalized to its own 2026 value of 100. The four matched comparisons hold technology, adoption, payment and AI cost fixed, changing demand, staffing response and gain participation in sequence. In reading order: flat demand with positions retained; demand +25% with positions retained; demand +25% with full staffing adjustment and both groups participating at 80%; then salaried participation reduced to 20% with all other conditions unchanged. Central technology is documentation/reasoning/procedure/interaction time savings of 50/30/15/10%, adoption 90% in both roles, no additional licensing change, capacity growth 40%, unchanged payment and AI cost 2%. The balanced task mix is 35/25/20/20% and the oversight floor is 20%.

The horizontal reference at 100 indicates remuneration maintenance per original member, including lost participation after position reduction; it is not earnings per retained physician. Equal index paths do not imply equal absolute remuneration. Shading shows pointwise minima and maxima from 243 finite parameter combinations per comparison (three task mixes, oversight floors, reconstructed role weights, payment offsets and demand offsets). These envelopes use the retained-rights compensation rule; they do not include the growth-only structural countermodel. They are parameter-grid ranges, not confidence intervals. Bands describe sensitivity around each center and should not be read as a perfectly matched contrast between every pair of envelope extrema. No probabilities or tests are assigned to the finite design.

## Main figure: Conditions for maintaining original-group earnings

Each curve gives the minimum purchased-care demand growth required to reach an own-role remuneration index of at least 100 per original group member in 2036. Columns vary staffing response (0, 0.5, 1); rows vary nonlabor capacity growth (+20%, +40%). The x-axis is the gain participation share. The balanced task mix and matched technology are fixed as in the preceding figure, with unchanged fees and AI cost 2%; alternative task profiles and payment/cost sensitivities remain in the numerical report. No role weighting is needed for this own-role target.

Solid curves use the current retained-rights rule (R); dashed curves use the growth-only structural alternative (G). If r is the retained-position fraction, R is gross care revenue relative to baseline, c is AI cost and s is gain participation, the earnings ratio is min(r,R) + s*r*max(0,R-r) - c under retained rights, versus min(r,R) + s*r*max(0,R-1) - c under growth only. Both subtract the same AI cost and truncate negative earnings at zero. Thus the countermodel restricts shared gains to revenue above the original baseline, rather than revenue above retained base remuneration. R in the equation means revenue; R in the strip is a retained-rights legend code.

Unavailable thresholds are absent from the numerical curve and appear as x-hatched segments in the separate R/G strips below each facet. They mean the earnings target cannot be reached even at the attainable care ceiling, not zero demand or a demand of 100%. Strip edges follow the sampled participation grid (steps 0.01), extending half a step to the neighboring cell boundary; exact boundary values are in the report. Finite curves join deterministic numerical threshold solutions and are not statistical fits. Under zero staffing response the two compensation rules coincide. Capacity facets have identical 0–40% demand axes. Neither the threshold nor its availability is a national job forecast; the target concerns earnings from the original modeled practice.

## Supplemental figure: Role earnings across six conditional scenarios

Solid clay and dashed sage lines show proprietor and salaried earnings, respectively, within the original modeled practice. Each role is normalized to its own 2026 earnings = 100, so equal indices do not imply equal currency earnings. The 2026 scenario origin carries forward the relative structure of the 2020 adjusted administrative remuneration anchors (proprietor KRW 294.3 million; salaried KRW 185.4 million). It is not an observed 2026 income estimate. Lines are the central scenario and shaded bands are pointwise minima and maxima over the declared deterministic design: three task mixes × three oversight floors × three reconstructed role weights × three payment offsets × three demand offsets (243 combinations per active scenario). The no-change scenario varies only structure (27 combinations). These bands combine structural and economic sensitivity; they are not sampling, trial, or forecast confidence intervals. When roles coincide, their lines and ranges overlap. The baseline reference is 100.

The scientific unit is a conditional model scenario, not an individual physician, hospital, or independent statistical replicate. Earnings account for position retention and gain participation in the original practice; outside earnings and passive returns after exit are excluded. Simultaneous facets share identical axes so the size and timing of scenario differences remain comparable. No inferential tests are performed.

## Supplemental figure: Demand and gain participation define the role-gap surface

Color shows the percentage change by 2036 in the proprietor-to-salaried earnings ratio, relative to its initial ratio: 100 × [(ratio in 2036 / initial ratio) − 1]. Positive values indicate widening and negative values narrowing. Columns hold staffing response at 0, 0.5, or 1. The axes vary purchased-care demand change and salaried gain participation. The grid retains the unequal-gain-sharing technology assumptions, fixes proprietor gain participation at 0.8 and capacity growth at 60%, and uses the balanced task mix and default oversight floor and role weights. Exact inputs remain in the scenario report and analysis generator.

Cells represent a deterministic grid (demand −40% to +60%, steps of 2 percentage points; salaried participation 0 to 1, steps of 0.05). The color scale is symmetric about zero with common limits of −32% and +32%. Contours, linearly interpolated between grid points, identify selected signed values; the zero contour is heavier. Absolute changes below 1e-8 percentage points are set to zero solely for rendering to suppress floating-point contour artifacts. White regions may be flat zero-valued regions, not missing data. The no-response region reflects no distributable productivity gain under those conditions. Task-mix alternatives and their min–max outcomes remain in the numerical report; this color surface shows the balanced task mix alone. Grid density has no probabilistic interpretation. The gap boundary largely follows the specified sharing rule and should not be treated as an empirical discovery. These surfaces are conditional comparative results, not national employment forecasts or causal estimates of ownership.

## Production

All four figures are separate 168 mm-wide assets in editable PDF/SVG and 300 dpi PNG. Arial is used at 8 pt for labels/ticks and 9 pt bold for axis labels. The matched-comparison and supplemental role figures are 116 mm high, the maintenance figure 142 mm, and the supplemental gap figure 91 mm. Files ending in `-proof.png` are 100 dpi inspection renders, and `-grayscale.png` checks redundant role linetypes and signed contours. The manifest records the figure contract, source/model/input hashes, pipeline versions, exact displayed text and exported file hashes. Reproduce with `uv run python scripts/plot-results.py`.
'''
(ROOT/'artifacts/figure-captions.md').write_text(captions)
manifest['caption_sha256']=sha(ROOT/'artifacts/figure-captions.md')
manifest['artifacts']={p.name:{'sha256':sha(p),'bytes':p.stat().st_size}
                       for p in sorted(OUT.iterdir()) if p.suffix in ['.pdf','.svg','.png']}
for name, spec in manifest['figures'].items():
    root = ET.parse(OUT / f'{name}.svg').getroot()
    pdf = (OUT / f'{name}.pdf').read_bytes()
    box = re.search(rb'/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]', pdf)
    dims = list(map(float, box.groups()))
    with Image.open(OUT / f'{name}.png') as im:
        spec['export_readback'] = {'svg_width': root.attrib['width'], 'svg_height': root.attrib['height'],
                                  'pdf_mediabox_pt': dims, 'png_pixels': list(im.size),
                                  'png_dpi': im.info.get('dpi'), 'font_Arial_in_pdf': b'Arial' in pdf,
                                  'editable_svg_text_elements': sum(e.tag.endswith('}text') for e in root.iter())}
    assert abs(dims[2]/72*25.4-168) < .01
    assert abs(dims[3]/72*25.4-spec['height_mm']) < .01
    assert spec['export_readback']['font_Arial_in_pdf']
proofs = [k for k in manifest['artifacts'] if 'proof' in k or 'grayscale' in k]
if previous.get('review', {}).get('visual', '').startswith('PASS:') and all(
        manifest['artifacts'][k]['sha256'] == previous.get('artifacts', {}).get(k, {}).get('sha256') for k in proofs):
    manifest['review']['visual'] = previous['review']['visual']
    manifest['review']['proofs'] = proofs
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print('Exported four 168 mm figures with PDF, SVG, PNG and inspection proofs.')
