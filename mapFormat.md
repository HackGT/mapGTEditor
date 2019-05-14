```
<svg>
    <!--
        outer-border
        The outer border of the map
        Requirements
            - Must contain ONLY ONE closed path
            - May contain one or more other groups with relevant classes

        inner-border
        The inner borders of the map
        Requirements
            - Must contain ONE OR MORE paths which may or may not be closed
            - Must NOT contain any other groups

        areas
        The areas (for example, rooms) within the map
        Requirements
            - Must contain ONE OR MORE groups having the class area
            - Must NOT contain any other groups

        area
        A specific area in the map
        Requirements
            - Must contain ONE closed path having a unique id
            - May contain one or more other groups with relevant classes

        icons
        The icons on the map

        serialized
        Marker for if the item is serialized or not
    -->

    <!-- VALID SAMPLES-->

    <!-- 1 -->
    <g class="outer-border">
        <path>
        </path>
        <g class="inner-border">
            <path>
            </path>
        </g>
        <g class="areas">
            <g class="area">
                <g class="icons serialized">
                </g>
            </g>
            <g class="area">
                <g class="icons serialized">
                </g>
            </g>
            <g class="icons">
            </g>
        </g>
    </g>

    <!-- 2 -->
    <g class="outer-border">
        <path>
        </path>
    </g>
    <g class="inner-border">
        <path>
        </path>
    </g>
    <g class="areas">
        <path class="area">
        </path>
        <path class="area">
        </path>
    </g>
    <g class="icons serialized">
    </g>
    <g class="icons">
    </g>

</svg>
```
