<? include_once($_SERVER['LOCAL_PATH']."/includes/segment.php") ?>
<!DOCTYPE html>
<html lang="da">
<head>
	<!-- (c) & (p) hvadhedderde.com 2011 //-->
	<!-- All material protected by copyrightlaws, as if you didnt know //-->
	<title><?= $page_title ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="language" content="da" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="MSSmartTagsPreventParsing" content="true" />
	<meta http-equiv="imagetoolbar" content="no" />
	<meta name="viewport" content="width=1024" />

	<? if($_SESSION["dev"]) { ?>
		<link type="text/css" rel="stylesheet" media="all" href="/css/lib/seg_<?= $_SESSION["segment"] ?>_include.css" />
		<script type="text/javascript" src="/js/lib/seg_<?= $_SESSION["segment"] ?>_include.js"></script>
	<? } else { ?>
		<link type="text/css" rel="stylesheet" media="all" href="/css/seg_<?= $_SESSION["segment"] ?>.css" />
		<script type="text/javascript" src="/js/seg_<?= $_SESSION["segment"] ?>.js"></script>
	<? } ?>

	<script type="text/javascript">
		var Tuborg = new function() {
			this.front_slides_image_path = "/attachments/front_slides";
			this.beers_image_path = "/attachments/beers";
			this.stories_image_path = "/attachments/stories";
			this.ads_video_path = "/attachments/ad_videos";
		}
	</script>
</head>

<body>

<div id="page" class="i:page">

	<div id="header">
		<ul class="servicenavigation">
			<li class="terms"><h4><a href="/betingelser" target="_blank">Betingelser</a></h4></li>
		</ul>
	</div>

	<div id="content" class="<?= $content_class ?>">
