var generateBreadcrumbJson = function(data) {

    var breadcrumbJson = {
        currentType : data.shortName,
<<<<<<< HEAD
=======
        breadCrumbStaticText : 'All',
>>>>>>> 7b77151d0d114757b90fecebbf53248c201f780b
        breadcrumb :
        [
            {
                assetType : "Gadget",
                url : "/publisher/assets/gadget/",
                assetIcon : "icon-dashboard" //font-awesome icon class
            },
            {
                assetType : "EBook",
                url : "/publisher/assets/ebook/",
                assetIcon : "icon-book" //font-awesome icon class
            },
            {
                assetType : "Site",
                url : "/publisher/assets/site/",
                assetIcon : "icon-compass" //font-awesome icon class
<<<<<<< HEAD
=======
            },
			{
                assetType : "Mobile App",
                url : "/publisher/assets/mobileapp/",
                assetIcon : "icon-app" //font-awesome icon class
>>>>>>> 7b77151d0d114757b90fecebbf53248c201f780b
            }
        ]
    };
    if(data.artifact){
        breadcrumbJson = {
            currentType : data.shortName,
            assetName : data.artifact.attributes.overview_name,
            currentVersion : data.artifact.attributes.overview_version,
            breadcrumb :
                [
                    {
                        assetType : "Gadget",
                        url : "/publisher/assets/gadget/",
                        assetIcon : "icon-dashboard" //font-awesome icon class
                    },
                    {
                        assetType : "EBook",
                        url : "/publisher/assets/ebook/",
                        assetIcon : "icon-book" //font-awesome icon class
                    },
                    {
                        assetType : "Site",
                        url : "/publisher/assets/site/",
                        assetIcon : "icon-compass" //font-awesome icon class
                    }
                ]
        };
    }
<<<<<<< HEAD
=======
    else if(data.op === "create"){
        var breadcrumbJson = {
            breadCrumbStaticText : 'Add Asset',
            currentType : data.shortName,
            breadcrumb :
                [
                    {
                        assetType : "Gadget",
                        url : "/publisher/assets/gadget/",
                        assetIcon : "icon-dashboard" //font-awesome icon class
                    },
                    {
                        assetType : "EBook",
                        url : "/publisher/assets/ebook/",
                        assetIcon : "icon-book" //font-awesome icon class
                    },
                    {
                        assetType : "Site",
                        url : "/publisher/assets/site/",
                        assetIcon : "icon-compass" //font-awesome icon class
                    }
                ]
        };
    }
    else if(data.op === "statistics"){
        var breadcrumbJson = {
            breadCrumbStaticText : 'statistics',
            currentType : data.shortName,
            breadcrumb :
                [
                    {
                        assetType : "Gadget",
                        url : "/publisher/assets/gadget/",
                        assetIcon : "icon-dashboard" //font-awesome icon class
                    },
                    {
                        assetType : "EBook",
                        url : "/publisher/assets/ebook/",
                        assetIcon : "icon-book" //font-awesome icon class
                    },
                    {
                        assetType : "Site",
                        url : "/publisher/assets/site/",
                        assetIcon : "icon-compass" //font-awesome icon class
                    }
                ]
        };
    }
>>>>>>> 7b77151d0d114757b90fecebbf53248c201f780b
    return breadcrumbJson;
};