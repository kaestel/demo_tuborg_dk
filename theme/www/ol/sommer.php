<?php $content_class = "beers" ?>
<?php $page_title = "Tuborg - Øl" ?>
<?php include_once($_SERVER["LOCAL_PATH"]."/templates/www.header.php") ?>

<div class="scene i:beers">
	<div class="beer i:beer bottle_id:10 bottle_format:png">
		<ul class="slides">
			<li class="main">
				<h1>Sommer</h1>
				<h2>Sommer og sol</h2>
				<div class="description">
					<p>Tuborg Sommer er et forfriskende mix af øl og limonade, som man kender det fra udlandet.</p>
					<p>Styrke: 2,3 % alkohol.</p>
				</div>
			</li>
		</ul>
	</div>

	<div class="beers">
		<ul>
			<li class="groentuborg"><a href="/ol/gron-tuborg">GRØN TUBORG</a></li>
			<li class="classic"><a href="/ol/tuborg-classic">TUBORG Classic</a></li>
			<li class="guldtuborg"><a href="/ol/guld-tuborg">Guld Tuborg</a></li>
			<li class="julebryg"><a href="/ol/julebryg">Julebryg</a></li>
			<li class="paaskebryg"><a href="/ol/paskebryg">Påskebryg</a></li>
			<li class="roedtuborg"><a href="/ol/rod-tuborg">Rød Tuborg</a></li>
			<li class="ultra"><a href="/ol/ultra-gron">ULTRA grøn</a></li>
			<li class="sommer"><a href="/ol/sommer">Sommer</a></li>
			<li class="ff"><a href="/ol/fine-festival">Fine Festival</a></li>
			<li class="superlight"><a href="/ol/super-light">Super Light</a></li>
		</ul>
	</div>
</div>

<?php include_once($_SERVER["LOCAL_PATH"]."/templates/www.footer.php") ?>
