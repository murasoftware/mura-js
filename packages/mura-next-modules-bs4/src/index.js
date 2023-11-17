import { default as Video, ModuleConfig as VideoConfig } from "./Video";
import { default as ArticleMeta } from "./ArticleMeta";
import { getDynamicProps as getCollectionDynamicProps, default as Collection , getLayout as getCollectionLayout, RouterlessLink , RouterLink, ModuleConfig as CollectionConfig } from "./Collection";
import { getQueryProps as getCollectionLayoutQueryProps, default as CollectionLayout, ModuleConfig as CollectionLayoutConfig} from "./CollectionLayout";
import { getQueryProps as getCollectionLayoutAccordionQueryProps, default as CollectionLayoutAccordion, ModuleConfig as CollectionLayoutAccordianConfig} from "./CollectionLayoutAccordion";
import { getQueryProps as getCollectionLayoutAlternatingBoxesQueryProps, default as CollectionLayoutAlternatingBoxes, ModuleConfig as CollectionLayoutAlternatingBoxesConfig} from "./CollectionLayoutAlternatingBoxes";
import { getQueryProps as getCollectionLayoutAlternatingRowsQueryProps, default as CollectionLayoutAlternatingRows, ModuleConfig as CollectionLayoutAlternatingRowsConfig} from "./CollectionLayoutAlternatingRows";
import { getQueryProps as getCollectionLayoutCardsQueryProps, default as CollectionLayoutCards, ModuleConfig as CollectionLayoutCardsConfig} from "./CollectionLayoutCards";
import { getQueryProps as getCollectionLayoutListQueryProps, default as CollectionLayoutList, ModuleConfig as CollectionLayoutListConfig} from "./CollectionLayoutList";
import { getQueryProps as getCollectionLayoutMasonryQueryProps, default as CollectionLayoutMasonry, ModuleConfig as CollectionLayoutMasonryConfig} from "./CollectionLayoutMasonry";
import { getQueryProps as getCollectionLayoutSlickSliderQueryProps, default as CollectionLayoutSlickSlider, ModuleConfig as CollectionLayoutSlickSliderConfig} from "./CollectionLayoutSlickSlider";
import CollectionNav from "./CollectionNav";
import CollectionReadMoreBtn from "./CollectionReadMoreBtn";
import {default as Container, ModuleConfig as ContainerConfig } from "./Container";
import { default as Hr, ModuleConfig as HrConfig} from "./Hr";
import { default as CTAButton, ModuleConfig as CTAButtonConfig } from "./CTAButton";
import { default as Embed, ModuleConfig as EmbedConfig } from "./Embed";
import { default as Image, ModuleConfig as ImageConfig } from "./Image";
import ItemCategories from "./ItemCategories";
import ItemCredits from "./ItemCredits";
import ItemDate from "./ItemDate";
import ItemImage from "./ItemImage";
import ItemTags from "./ItemTags";
import { default as Login, ModuleConfig as LoginConfig } from "./Login";
import { getDynamicProps as getMatrixSelectorDynamicProps, default as MatrixSelector, ModuleConfig as MatrixSelectorConfig} from "./MatrixSelector";
import NoItemsMessage from "./NoItemsMessage";
import OutputMarkup from "./OutputMarkup";
import { getDynamicProps as getPrimaryNavDynamicProps, default as PrimaryNav, ModuleConfig as PrimaryNavConfig} from "./PrimaryNav";
import { getDynamicProps as getResourceHubDynamicProps, default as ResourceHub, ModuleConfig as ResourceHubConfig} from "./ResourceHub";
import { getDynamicProps as getTextDynamicProps, default as Text, ModuleConfig as TextConfig} from "./Text";
import { default as PrivacyTools, ModuleConfig as PrivacyToolsConfig } from "./PrivacyTools";
import { default as GatedAsset, ModuleConfig as GatedAssetConfig}  from "./GatedAsset";
import { default as Gist, ModuleConfig as GistConfig } from "./Gist";
import { default as SearchResults, getDynamicProps as getSearchResultsDynamicProps, ModuleConfig as SearchResultsConfig } from "./SearchResults";
import { default as SearchResultsLayout, ModuleConfig as SearchResultsLayoutConfig } from "./SearchResultsLayout";
import SearchForm from "./SearchForm";
import { default as UtilityNav, ModuleConfig as UtilityNavConfig } from "./UtilityNav";
import { default as MuraClassicWrapper, getDynamicProps as getMuraClassicDynamicProps } from "./MuraClassicWrapper";

export {
    Video,
    ArticleMeta,
    getCollectionDynamicProps,
    Collection,
    getCollectionLayout,
    RouterlessLink,
    RouterLink,
    getCollectionLayoutQueryProps,
    CollectionLayout,
    CollectionLayoutAccordion,
    getCollectionLayoutAccordionQueryProps,
    getCollectionLayoutAlternatingBoxesQueryProps,
    CollectionLayoutAlternatingBoxes,
    getCollectionLayoutAlternatingRowsQueryProps,
    CollectionLayoutAlternatingRows,
    getCollectionLayoutCardsQueryProps,
    CollectionLayoutCards,
    getCollectionLayoutListQueryProps,
    CollectionLayoutList,
    getCollectionLayoutMasonryQueryProps,
    CollectionLayoutMasonry,
    getCollectionLayoutSlickSliderQueryProps,
    CollectionLayoutSlickSlider,
    CollectionNav,
    CollectionReadMoreBtn,
    Container,
    Hr,
    CTAButton,
    Embed,
    Image,
    ItemCategories,
    ItemCredits,
    ItemDate,
    ItemImage,
    ItemTags,
    Login,
    getMatrixSelectorDynamicProps,
    MatrixSelector,
    getPrimaryNavDynamicProps,
    PrimaryNav,
    getResourceHubDynamicProps,
    ResourceHub,
    getTextDynamicProps,
    Text,
    PrivacyTools,
    NoItemsMessage,
    OutputMarkup,
    GatedAsset,
    Gist,
    SearchResults,
    getSearchResultsDynamicProps,
    SearchResultsLayout,
    SearchForm,
    UtilityNav,
    MuraClassicWrapper,
    getMuraClassicDynamicProps

};

export const ModuleLibrary={
    rendererProperties:{
        templateArray:["default"],
        collectionLayoutArray:[],
        collectionDefaultLayout:"List",
        SSR:false,
        hashurls:false,
        primaryContentTypes:"Page,Link,File",
        editableAttributesArray:[],
        imageAttributesArray:[],
        defaultInheritedRegions:["header","footer"],
        spacingOptions:[
            {"name":"Tight","value":"tight"},
            {"name":"Tight Vertical","value":"tight-y"},
            {"name":"Tight Top","value":"tight-top"},
            {"name":"Tight Bottom","value":"tight-bottom"},
            {"name":"Tight Left","value":"tight-left"},
            {"name":"Tight Right","value":"tight-right"},
            {"name":"Normal","value":"normal"},
            {"name":"Normal Vertical","value":"normal-y"},
            {"name":"Normal Top","value":"normal-top"},
            {"name":"Normal Bottom","value":"normal-bottom"},
            {"name":"Normal Left","value":"normal-left"},
            {"name":"Normal Right","value":"normal-right"},
            {"name":"Loose","value":"loose"},
            {"name":"Loose Vertical","value":"loose-y"},
            {"name":"Loose Top","value":"loose-top"},
            {"name":"Loose Bottom","value":"loose-bottom"},
            {"name":"Loose Left","value":"loose-left"},
            {"name":"Loose Right","value":"loose-right"}
        ],
        moduleThemeOptions:[
            {
                "name":"Brand Default",
                "value":"module-brand",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Black",
                "value":"module-black",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Light Gray",
                "value":"module-light-gray",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Medium Gray",
                "value":"module-medium-gray",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Dark Gray",
                "value":"module-dark-gray",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Orange",
                "value":"module-orange",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Red",
                "value":"module-red",
                "modules":"*"
            },
            {
                "name":"Azul",
                "value":"module-azul",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Sea Foam",
                "value":"module-sea-foam",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Teal",
                "value":"module-teal",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Green",
                "value":"module-green",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Cranberry",
                "value":"module-cranberry",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Goldenrod",
                "value":"module-goldenrod",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Violet",
                "value":"module-violet",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Purple",
                "value":"module-purple",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Blue",
                "value":"module-blue",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"White",
                "value":"module-white",
                "modules":"*",
                "omitmodules":""
            },
            {
                "name":"Equal Height Icons XS (50px)",
                "value":"module-equal-height-icons",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Equal Height Icons SM (75px)",
                "value":"module-equal-height-icons",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Equal Height Icons MD (100px)",
                "value":"module-equal-height-icons",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Equal Height Icons LG (150px)",
                "value":"module-equal-height-icons-lg",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Equal Height Icons XL (200px)",
                "value":"module-equal-height-icons-xl",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Center Icons",
                "value":"module-center-icons",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Cards",
                "value":"module-text-cards",
                "modules":"container",
                "omitmodules":""
            },
            {
                "name":"Image Grid",
                "value":"module-image-grid",
                "modules":"container",
                "omitmodules":""
            }
        ],
        layoutOptions:[
            {"name":"40/60","value":"module-layout-40-60","modules":"container"},
            {"name":"60/40","value":"module-layout-60-40","modules":"container"},
            {"name":"2 Columns","value":"module-layout-two-col","modules":"container"},
            {"name":"3 Columns","value":"module-layout-three-col","modules":"container"},
            {"name":"4 Columns","value":"module-layout-four-col","modules":"container"},
            {"name":"5 Columns","value":"module-layout-five-col","modules":"container"},
            {"name":"6 Columns","value":"module-layout-six-col","modules":"container"}
        ]
    },
    moduleRegistry:[ 
        // {
        //     name: 'cta',
        //     js:[
        //         ()=>{return this.ConnectorConfig.rootpath + "/core/modules/v1/cta/js/mura.displayobject.cta.min.js"},
        //     ],
        //     SSR: false
        // },
        // {
        //     name: 'content_gate',
        //     js:[
        //         ()=>{return this.ConnectorConfig.rootpath + "/core/modules/v1/content_gate/js/mura.displayobject.content_gate.min.js"},
        //     ],
        //     SSR: false
        // },
        // {
        //     name: 'pdfviewer',
        //     js:[
        //         ()=>{return this.ConnectorConfig.rootpath + "/core/modules/v1/pdfviewer/dist/main.bundle.js"},
        //     ],
        //     SSR: false
        // },
        // {
        //     name: 'form',
        //     SSR: false
        // },
        // {
        //     name: 'cookie_consent',
        //     SSR: false
        // },
        // {
        //     name: 'login',
        //     SSR: false
        // },
        VideoConfig,
        CollectionConfig,
        CollectionLayoutConfig,
        CollectionLayoutAccordianConfig,
        CollectionLayoutAlternatingRowsConfig,
        CollectionLayoutCardsConfig,
        CollectionLayoutListConfig,
        CollectionLayoutMasonryConfig,
        CollectionLayoutSlickSliderConfig,
        ContainerConfig,
        EmbedConfig,
        GatedAssetConfig,
        HrConfig,
        ImageConfig,
        GistConfig,
        LoginConfig,
        MatrixSelectorConfig,
        PrimaryNavConfig,
        PrivacyToolsConfig,
        ResourceHubConfig,
        SearchResultsConfig,
        SearchResultsLayoutConfig,
        TextConfig,
        UtilityNavConfig,
    ]     
}
